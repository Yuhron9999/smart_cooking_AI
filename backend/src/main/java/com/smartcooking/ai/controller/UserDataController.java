package com.smartcooking.ai.controller;

import com.smartcooking.ai.dto.*;
import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.service.UserDataService;
import com.smartcooking.ai.service.UserService;
import com.smartcooking.ai.service.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
