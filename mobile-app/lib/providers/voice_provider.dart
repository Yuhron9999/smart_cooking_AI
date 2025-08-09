import 'package:flutter/foundation.dart';
// import 'package:speech_to_text/speech_to_text.dart' as stt;
// import 'package:flutter_tts/flutter_tts.dart';
import '../services/api_service.dart';

enum VoiceState { inactive, listening, processing, speaking, error }

enum VoiceCommand {
  createRecipe,
  findRecipe,
  getIngredients,
  getCookingInstructions,
  setTimer,
  convertUnits,
  getNutritionInfo,
  unknown,
}

class VoiceProvider with ChangeNotifier {
  // Voice state
  VoiceState _voiceState = VoiceState.inactive;
  String? _error;
  bool _isInitialized = false;

  // Mock voice data for development
  String _lastTranscript = '';
  double _confidence = 0.0;

  // Voice settings
  String _currentLanguage = 'vi-VN';
  double _speechRate = 0.5;
  double _volume = 1.0;
  double _pitch = 1.0;

  // Command processing
  VoiceCommand _lastCommand = VoiceCommand.unknown;

  // Services
  final ApiService _apiService = ApiService();

  // Getters
  VoiceState get voiceState => _voiceState;
  String? get error => _error;
  bool get isInitialized => _isInitialized;
  String get lastTranscript => _lastTranscript;
  double get confidence => _confidence;
  String get currentLanguage => _currentLanguage;
  double get speechRate => _speechRate;
  double get volume => _volume;
  double get pitch => _pitch;
  VoiceCommand get lastCommand => _lastCommand;

  bool get isListening => _voiceState == VoiceState.listening;
  bool get isProcessing => _voiceState == VoiceState.processing;
  bool get isSpeaking => _voiceState == VoiceState.speaking;
  bool get hasError => _voiceState == VoiceState.error;

  // Initialize voice services (mocked for now)
  Future<void> initialize() async {
    try {
      _isInitialized = true;
      _voiceState = VoiceState.inactive;
      notifyListeners();
    } catch (e) {
      _error = 'Failed to initialize voice services: $e';
      _voiceState = VoiceState.error;
      notifyListeners();
    }
  }

  // Mock methods for voice functionality
  Future<void> startListening() async {
    if (!_isInitialized) return;

    _voiceState = VoiceState.listening;
    _error = null;
    notifyListeners();

    // Simulate listening - in real app this would use speech_to_text
    await Future.delayed(const Duration(seconds: 2));
    _lastTranscript = "Tôi muốn nấu món phở";
    _confidence = 0.85;
    _voiceState = VoiceState.processing;
    notifyListeners();

    await _processCommand(_lastTranscript);
  }

  Future<void> stopListening() async {
    _voiceState = VoiceState.inactive;
    notifyListeners();
  }

  Future<void> _processCommand(String text) async {
    // Mock command processing
    _lastCommand = _detectCommand(text);

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));

    _voiceState = VoiceState.inactive;
    notifyListeners();
  }

  VoiceCommand _detectCommand(String text) {
    text = text.toLowerCase();

    if (text.contains('nấu') || text.contains('công thức')) {
      return VoiceCommand.findRecipe;
    } else if (text.contains('nguyên liệu')) {
      return VoiceCommand.getIngredients;
    } else if (text.contains('hướng dẫn')) {
      return VoiceCommand.getCookingInstructions;
    } else if (text.contains('dinh dưỡng')) {
      return VoiceCommand.getNutritionInfo;
    }

    return VoiceCommand.unknown;
  }

  // Settings
  void setLanguage(String language) {
    _currentLanguage = language;
    notifyListeners();
  }

  void setSpeechRate(double rate) {
    _speechRate = rate;
    notifyListeners();
  }

  void setVolume(double volume) {
    _volume = volume;
    notifyListeners();
  }

  void setPitch(double pitch) {
    _pitch = pitch;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    if (_voiceState == VoiceState.error) {
      _voiceState = VoiceState.inactive;
    }
    notifyListeners();
  }
}
