import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class LocationProvider with ChangeNotifier {
  Position? _currentPosition;
  String? _currentAddress;
  bool _isLoading = false;
  String? _error;
  bool _locationPermissionGranted = false;

  // Getters
  Position? get currentPosition => _currentPosition;
  String? get currentAddress => _currentAddress;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get locationPermissionGranted => _locationPermissionGranted;

  /// Initialize location services
  Future<void> initialize() async {
    await _checkLocationPermission();
    if (_locationPermissionGranted) {
      await getCurrentLocation();
    }
  }

  /// Check and request location permission
  Future<void> _checkLocationPermission() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _setError('Location services are disabled');
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _setError('Location permissions are denied');
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _setError('Location permissions are permanently denied');
        return;
      }

      _locationPermissionGranted = true;
      _clearError();
    } catch (e) {
      _setError('Error checking location permission: ${e.toString()}');
    }
  }

  /// Get current location
  Future<void> getCurrentLocation() async {
    if (!_locationPermissionGranted) {
      await _checkLocationPermission();
      if (!_locationPermissionGranted) return;
    }

    try {
      _setLoading(true);
      _clearError();

      _currentPosition = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      await _getAddressFromPosition(_currentPosition!);

      _setLoading(false);
    } catch (e) {
      _setError('Error getting location: ${e.toString()}');
      _setLoading(false);
    }
  }

  /// Get address from position
  Future<void> _getAddressFromPosition(Position position) async {
    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks.first;
        _currentAddress =
            '${place.locality}, ${place.administrativeArea}, ${place.country}';
      }
    } catch (e) {
      debugPrint('Error getting address: ${e.toString()}');
      _currentAddress = 'Unknown location';
    }
  }

  /// Get distance between two positions
  double getDistanceBetween(
    double startLatitude,
    double startLongitude,
    double endLatitude,
    double endLongitude,
  ) {
    return Geolocator.distanceBetween(
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
    );
  }

  /// Check if location is near current position
  bool isNearCurrentLocation(
    double latitude,
    double longitude, {
    double radiusInMeters = 1000,
  }) {
    if (_currentPosition == null) return false;

    double distance = getDistanceBetween(
      _currentPosition!.latitude,
      _currentPosition!.longitude,
      latitude,
      longitude,
    );

    return distance <= radiusInMeters;
  }

  /// Set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set error message
  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  /// Clear error message
  void _clearError() {
    _error = null;
  }

  /// Clear all data
  void clear() {
    _currentPosition = null;
    _currentAddress = null;
    _error = null;
    _isLoading = false;
    notifyListeners();
  }
}
