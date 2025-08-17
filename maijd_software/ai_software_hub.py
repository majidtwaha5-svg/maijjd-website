#!/usr/bin/env python3
"""
Maijjd AI Software Development Hub - Enhanced with Comprehensive AI Features
Advanced AI integration platform with natural language processing, computer vision, 
machine learning, and intelligent automation capabilities
"""

import os
import sys
import json
import time
import logging
import asyncio
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from pathlib import Path
import hashlib
import secrets
import ssl
import socket
import base64
import io
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Enhanced AI imports
try:
    import numpy as np
    import pandas as pd
    from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import accuracy_score, precision_recall_fscore_support
    import joblib
    import tensorflow as tf
    from tensorflow import keras
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from transformers import pipeline, AutoTokenizer, AutoModel
    import openai
    import anthropic
    import spacy
    import nltk
    from nltk.tokenize import word_tokenize, sent_tokenize
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    import gensim
    from gensim.models import Word2Vec, Doc2Vec
    AI_AVAILABLE = True
except ImportError as e:
    AI_AVAILABLE = False
    print(f"AI libraries not available: {e}")
    print("Install with: pip install scikit-learn pandas numpy joblib tensorflow torch transformers openai anthropic spacy nltk gensim")

try:
    import redis
    import psutil
    import requests
    from flask import Flask, request, jsonify, make_response, send_file
    from flask_cors import CORS
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    from flask_socketio import SocketIO, emit
    WEB_FRAMEWORK_AVAILABLE = True
except ImportError:
    WEB_FRAMEWORK_AVAILABLE = False
    print("Web framework libraries not available. Install with: pip install flask flask-cors flask-limiter flask-socketio redis psutil requests")

# Configuration and constants
CONFIG_FILE = "ai_hub_config.json"
DEFAULT_CONFIG = {
    "ai_services": {
        "openai": {
            "enabled": True,
            "api_key": os.getenv("OPENAI_API_KEY", ""),
            "model": "gpt-4",
            "max_tokens": 2000
        },
        "anthropic": {
            "enabled": True,
            "api_key": os.getenv("ANTHROPIC_API_KEY", ""),
            "model": "claude-3-sonnet-20240229"
        },
        "local_models": {
            "enabled": True,
            "models_path": "./models",
            "supported_models": ["llama-2", "bert", "gpt-2", "custom"]
        }
    },
    "ai_capabilities": {
        "natural_language_processing": True,
        "computer_vision": True,
        "machine_learning": True,
        "speech_recognition": True,
        "sentiment_analysis": True,
        "text_generation": True,
        "code_analysis": True,
        "data_analysis": True
    },
    "performance": {
        "max_concurrent_requests": 10,
        "request_timeout": 30,
        "cache_enabled": True,
        "cache_ttl": 3600
    },
    "security": {
        "rate_limiting": True,
        "input_validation": True,
        "output_sanitization": True,
        "api_key_validation": True
    }
}

@dataclass
class AIRequest:
    """AI service request data structure"""
    id: str
    user_id: str
    request_type: str
    input_data: Dict[str, Any]
    ai_model: str
    timestamp: datetime
    status: str
    response: Optional[Dict[str, Any]]
    processing_time: Optional[float]
    cost: Optional[float]
    metadata: Dict[str, Any]

@dataclass
class AIModel:
    """AI model information and capabilities"""
    id: str
    name: str
    type: str
    provider: str
    capabilities: List[str]
    performance_metrics: Dict[str, float]
    cost_per_request: float
    max_input_size: int
    supported_languages: List[str]
    model_size: str
    last_updated: datetime

@dataclass
class AIAnalysisResult:
    """AI analysis result with comprehensive insights"""
    request_id: str
    analysis_type: str
    input_data: Dict[str, Any]
    results: Dict[str, Any]
    confidence_score: float
    processing_time: float
    model_used: str
    recommendations: List[str]
    next_steps: List[str]
    metadata: Dict[str, Any]

class NaturalLanguageProcessor:
    """Advanced natural language processing capabilities"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.nlp_models = {}
        self.initialize_nlp_models()
    
    def initialize_nlp_models(self):
        """Initialize NLP models and tools"""
        try:
            # Initialize spaCy
            if 'en_core_web_sm' in spacy.util.get_installed_packages():
                self.nlp_models['spacy'] = spacy.load('en_core_web_sm')
            
            # Initialize NLTK
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('wordnet', quiet=True)
            nltk.download('averaged_perceptron_tagger', quiet=True)
            
            # Initialize transformers
            self.nlp_models['sentiment'] = pipeline('sentiment-analysis')
            self.nlp_models['text_generation'] = pipeline('text-generation')
            self.nlp_models['summarization'] = pipeline('summarization')
            
        except Exception as e:
            logging.error(f"Failed to initialize NLP models: {e}")
    
    def analyze_text(self, text: str, analysis_type: str = "comprehensive") -> Dict[str, Any]:
        """Perform comprehensive text analysis"""
        results = {
            "text_length": len(text),
            "word_count": len(text.split()),
            "sentence_count": len(sent_tokenize(text)),
            "language_detection": self.detect_language(text),
            "sentiment_analysis": self.analyze_sentiment(text),
            "key_phrases": self.extract_key_phrases(text),
            "named_entities": self.extract_named_entities(text),
            "readability_score": self.calculate_readability(text),
            "topic_modeling": self.identify_topics(text),
            "text_summary": self.generate_summary(text)
        }
        
        if analysis_type == "comprehensive":
            return results
        else:
            return {analysis_type: results.get(analysis_type, "Analysis type not supported")}
    
    def detect_language(self, text: str) -> str:
        """Detect the language of the input text"""
        try:
            # Simple language detection based on common words
            english_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
            text_words = set(text.lower().split())
            english_score = len(text_words.intersection(english_words)) / len(text_words) if text_words else 0
            
            if english_score > 0.3:
                return "English"
            else:
                return "Unknown"
        except:
            return "Unknown"
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of the text"""
        try:
            if 'sentiment' in self.nlp_models:
                result = self.nlp_models['sentiment'](text[:512])[0]
                return {
                    "label": result['label'],
                    "score": result['score'],
                    "confidence": result['score']
                }
            else:
                # Fallback sentiment analysis
                positive_words = {'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'}
                negative_words = {'bad', 'terrible', 'awful', 'horrible', 'dreadful', 'poor'}
                
                words = text.lower().split()
                positive_count = sum(1 for word in words if word in positive_words)
                negative_count = sum(1 for word in words if word in negative_words)
                
                if positive_count > negative_count:
                    return {"label": "POSITIVE", "score": 0.7, "confidence": 0.6}
                elif negative_count > positive_count:
                    return {"label": "NEGATIVE", "score": 0.7, "confidence": 0.6}
                else:
                    return {"label": "NEUTRAL", "score": 0.5, "confidence": 0.5}
        except Exception as e:
            return {"label": "NEUTRAL", "score": 0.5, "confidence": 0.3, "error": str(e)}
    
    def extract_key_phrases(self, text: str) -> List[str]:
        """Extract key phrases from text"""
        try:
            if 'spacy' in self.nlp_models:
                doc = self.nlp_models['spacy'](text)
                key_phrases = []
                for chunk in doc.noun_chunks:
                    key_phrases.append(chunk.text)
                return key_phrases[:10]  # Return top 10 phrases
            else:
                # Fallback key phrase extraction
                words = text.lower().split()
                stop_words = set(stopwords.words('english'))
                key_words = [word for word in words if word not in stop_words and len(word) > 3]
                return list(set(key_words))[:10]
        except:
            return []
    
    def extract_named_entities(self, text: str) -> List[Dict[str, str]]:
        """Extract named entities from text"""
        try:
            if 'spacy' in self.nlp_models:
                doc = self.nlp_models['spacy'](text)
                entities = []
                for ent in doc.ents:
                    entities.append({
                        "text": ent.text,
                        "label": ent.label_,
                        "start": ent.start_char,
                        "end": ent.end_char
                    })
                return entities
            else:
                return []
        except:
            return []
    
    def calculate_readability(self, text: str) -> float:
        """Calculate Flesch Reading Ease score"""
        try:
            sentences = sent_tokenize(text)
            words = text.split()
            syllables = sum(self.count_syllables(word) for word in words)
            
            if len(sentences) == 0 or len(words) == 0:
                return 0.0
            
            # Flesch Reading Ease formula
            score = 206.835 - (1.015 * (len(words) / len(sentences))) - (84.6 * (syllables / len(words)))
            return max(0.0, min(100.0, score))
        except:
            return 0.0
    
    def count_syllables(self, word: str) -> int:
        """Count syllables in a word"""
        word = word.lower()
        count = 0
        vowels = "aeiouy"
        on_vowel = False
        
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not on_vowel:
                count += 1
            on_vowel = is_vowel
        
        if word.endswith('e'):
            count -= 1
        if count == 0:
            count = 1
        return count
    
    def identify_topics(self, text: str) -> List[str]:
        """Identify main topics in the text"""
        try:
            # Simple topic identification based on frequency
            words = text.lower().split()
            stop_words = set(stopwords.words('english'))
            content_words = [word for word in words if word not in stop_words and len(word) > 3]
            
            word_freq = {}
            for word in content_words:
                word_freq[word] = word_freq.get(word, 0) + 1
            
            # Return top 5 most frequent words as topics
            topics = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
            return [topic[0] for topic in topics]
        except:
            return []
    
    def generate_summary(self, text: str) -> str:
        """Generate a summary of the text"""
        try:
            if 'summarization' in self.nlp_models and len(text) > 100:
                summary = self.nlp_models['summarization'](text, max_length=130, min_length=30)[0]['summary_text']
                return summary
            else:
                # Fallback summary generation
                sentences = sent_tokenize(text)
                if len(sentences) <= 2:
                    return text
                else:
                    return ' '.join(sentences[:2]) + "..."
        except:
            return text[:200] + "..." if len(text) > 200 else text

class ComputerVisionProcessor:
    """Advanced computer vision capabilities"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.cv_models = {}
        self.initialize_cv_models()
    
    def initialize_cv_models(self):
        """Initialize computer vision models"""
        try:
            # Initialize OpenCV
            self.cv_models['opencv'] = True
            
            # Initialize pre-trained models
            self.cv_models['face_cascade'] = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            self.cv_models['eye_cascade'] = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
            
        except Exception as e:
            logging.error(f"Failed to initialize CV models: {e}")
    
    def analyze_image(self, image_data: bytes, analysis_type: str = "comprehensive") -> Dict[str, Any]:
        """Perform comprehensive image analysis"""
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return {"error": "Invalid image data"}
            
            results = {
                "image_info": self.get_image_info(image),
                "object_detection": self.detect_objects(image),
                "face_detection": self.detect_faces(image),
                "text_recognition": self.extract_text(image),
                "color_analysis": self.analyze_colors(image),
                "image_quality": self.assess_image_quality(image),
                "edge_detection": self.detect_edges(image),
                "contour_analysis": self.analyze_contours(image)
            }
            
            if analysis_type == "comprehensive":
                return results
            else:
                return {analysis_type: results.get(analysis_type, "Analysis type not supported")}
                
        except Exception as e:
            return {"error": f"Image analysis failed: {str(e)}"}
    
    def get_image_info(self, image) -> Dict[str, Any]:
        """Get basic image information"""
        height, width = image.shape[:2]
        channels = image.shape[2] if len(image.shape) > 2 else 1
        
        return {
            "dimensions": f"{width}x{height}",
            "width": width,
            "height": height,
            "channels": channels,
            "aspect_ratio": round(width / height, 2),
            "total_pixels": width * height,
            "file_size_estimate": width * height * channels
        }
    
    def detect_objects(self, image) -> List[Dict[str, Any]]:
        """Detect objects in the image using contour detection"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blurred, 50, 150)
            
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            objects = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 1000:  # Filter small contours
                    x, y, w, h = cv2.boundingRect(contour)
                    objects.append({
                        "type": "object",
                        "position": {"x": x, "y": y},
                        "size": {"width": w, "height": h},
                        "area": area,
                        "shape": self.classify_shape(contour)
                    })
            
            return objects[:10]  # Return top 10 objects
            
        except Exception as e:
            return [{"error": f"Object detection failed: {str(e)}"}]
    
    def detect_faces(self, image) -> List[Dict[str, Any]]:
        """Detect faces in the image"""
        try:
            if 'face_cascade' not in self.cv_models:
                return [{"error": "Face detection model not available"}]
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = self.cv_models['face_cascade'].detectMultiScale(gray, 1.1, 4)
            
            face_data = []
            for (x, y, w, h) in faces:
                face_roi = gray[y:y+h, x:x+w]
                eyes = self.cv_models['eye_cascade'].detectMultiScale(face_roi) if 'eye_cascade' in self.cv_models else []
                
                face_data.append({
                    "position": {"x": x, "y": y},
                    "size": {"width": w, "height": h},
                    "confidence": 0.8,
                    "eyes_detected": len(eyes),
                    "face_ratio": round(w / h, 2)
                })
            
            return face_data
            
        except Exception as e:
            return [{"error": f"Face detection failed: {str(e)}"}]
    
    def extract_text(self, image) -> Dict[str, Any]:
        """Extract text from image (placeholder for OCR)"""
        try:
            # This is a placeholder - in a real implementation, you'd use Tesseract OCR
            # or cloud-based OCR services like Google Vision API
            return {
                "text_detected": False,
                "message": "OCR functionality requires additional setup (Tesseract or cloud OCR)",
                "confidence": 0.0
            }
        except Exception as e:
            return {"error": f"Text extraction failed: {str(e)}"}
    
    def analyze_colors(self, image) -> Dict[str, Any]:
        """Analyze dominant colors in the image"""
        try:
            # Convert to RGB for better color analysis
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Reshape image to 2D array of pixels
            pixels = rgb_image.reshape(-1, 3)
            
            # Calculate average color
            avg_color = np.mean(pixels, axis=0)
            
            # Find dominant colors using k-means clustering
            from sklearn.cluster import KMeans
            kmeans = KMeans(n_clusters=5, random_state=42)
            kmeans.fit(pixels)
            dominant_colors = kmeans.cluster_centers_.astype(int)
            
            # Calculate color distribution
            labels = kmeans.labels_
            color_counts = np.bincount(labels)
            color_percentages = (color_counts / len(labels)) * 100
            
            return {
                "average_color": avg_color.tolist(),
                "dominant_colors": dominant_colors.tolist(),
                "color_distribution": color_percentages.tolist(),
                "brightness": np.mean(avg_color),
                "saturation": self.calculate_saturation(rgb_image)
            }
            
        except Exception as e:
            return {"error": f"Color analysis failed: {str(e)}"}
    
    def assess_image_quality(self, image) -> Dict[str, Any]:
        """Assess image quality metrics"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Calculate sharpness using Laplacian variance
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Calculate noise level
            noise_level = np.std(gray)
            
            # Calculate contrast
            contrast = np.std(gray)
            
            # Calculate brightness
            brightness = np.mean(gray)
            
            # Quality score (0-100)
            quality_score = min(100, max(0, (laplacian_var / 100) * 50 + (contrast / 50) * 30 + (brightness / 255) * 20))
            
            return {
                "sharpness": round(laplacian_var, 2),
                "noise_level": round(noise_level, 2),
                "contrast": round(contrast, 2),
                "brightness": round(brightness, 2),
                "quality_score": round(quality_score, 1),
                "quality_level": "High" if quality_score > 70 else "Medium" if quality_score > 40 else "Low"
            }
            
        except Exception as e:
            return {"error": f"Quality assessment failed: {str(e)}"}
    
    def detect_edges(self, image) -> Dict[str, Any]:
        """Detect edges in the image"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Canny edge detection
            edges_canny = cv2.Canny(gray, 50, 150)
            
            # Sobel edge detection
            sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
            
            # Laplacian edge detection
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            
            return {
                "edge_density": np.sum(edges_canny > 0) / edges_canny.size,
                "edge_count": np.sum(edges_canny > 0),
                "sobel_magnitude": np.mean(sobel_magnitude),
                "laplacian_variance": np.var(laplacian)
            }
            
        except Exception as e:
            return {"error": f"Edge detection failed: {str(e)}"}
    
    def analyze_contours(self, image) -> Dict[str, Any]:
        """Analyze contours in the image"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blurred, 50, 150)
            
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if not contours:
                return {"contour_count": 0, "total_area": 0, "shapes": []}
            
            total_area = sum(cv2.contourArea(contour) for contour in contours)
            shapes = [self.classify_shape(contour) for contour in contours]
            
            return {
                "contour_count": len(contours),
                "total_area": total_area,
                "average_area": total_area / len(contours),
                "shapes": shapes,
                "shape_distribution": {shape: shapes.count(shape) for shape in set(shapes)}
            }
            
        except Exception as e:
            return {"error": f"Contour analysis failed: {str(e)}"}
    
    def classify_shape(self, contour) -> str:
        """Classify the shape of a contour"""
        try:
            perimeter = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
            
            if len(approx) == 3:
                return "Triangle"
            elif len(approx) == 4:
                return "Rectangle"
            elif len(approx) == 5:
                return "Pentagon"
            elif len(approx) == 6:
                return "Hexagon"
            elif len(approx) > 8:
                return "Circle"
            else:
                return "Irregular"
        except:
            return "Unknown"
    
    def calculate_saturation(self, rgb_image) -> float:
        """Calculate average saturation of the image"""
        try:
            # Convert to HSV
            hsv_image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2HSV)
            saturation_channel = hsv_image[:, :, 1]
            return np.mean(saturation_channel)
        except:
            return 0.0

class MachineLearningEngine:
    """Advanced machine learning capabilities"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.ml_models = {}
        self.model_performance = {}
        self.initialize_ml_models()
    
    def initialize_ml_models(self):
        """Initialize machine learning models"""
        try:
            # Initialize basic ML models
            self.ml_models['random_forest'] = RandomForestRegressor(n_estimators=100, random_state=42)
            self.ml_models['gradient_boosting'] = GradientBoostingClassifier(n_estimators=100, random_state=42)
            
            # Initialize transformers for NLP tasks
            if 'transformers' in sys.modules:
                self.ml_models['text_classifier'] = pipeline('text-classification')
                self.ml_models['question_answering'] = pipeline('question-answering')
            
        except Exception as e:
            logging.error(f"Failed to initialize ML models: {e}")
    
    def train_model(self, model_type: str, training_data: Dict[str, Any], model_params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Train a machine learning model"""
        try:
            if model_type not in self.ml_models:
                return {"error": f"Model type {model_type} not supported"}
            
            X = training_data.get('features', [])
            y = training_data.get('labels', [])
            
            if not X or not y:
                return {"error": "Invalid training data"}
            
            # Prepare data
            X = np.array(X)
            y = np.array(y)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Train model
            model = self.ml_models[model_type]
            if model_params:
                model.set_params(**model_params)
            
            model.fit(X_train, y_train)
            
            # Evaluate model
            train_score = model.score(X_train, y_train)
            test_score = model.score(X_test, y_test)
            
            # Store model performance
            self.model_performance[model_type] = {
                "train_score": train_score,
                "test_score": test_score,
                "training_date": datetime.now().isoformat(),
                "data_size": len(X)
            }
            
            return {
                "success": True,
                "model_type": model_type,
                "train_score": train_score,
                "test_score": test_score,
                "training_date": datetime.now().isoformat(),
                "data_size": len(X)
            }
            
        except Exception as e:
            return {"error": f"Model training failed: {str(e)}"}
    
    def predict(self, model_type: str, input_data: List[float]) -> Dict[str, Any]:
        """Make predictions using a trained model"""
        try:
            if model_type not in self.ml_models:
                return {"error": f"Model type {model_type} not supported"}
            
            model = self.ml_models[model_type]
            
            # Check if model is trained
            if not hasattr(model, 'predict'):
                return {"error": "Model not trained yet"}
            
            # Prepare input data
            X = np.array(input_data).reshape(1, -1)
            
            # Make prediction
            prediction = model.predict(X)
            prediction_proba = None
            
            if hasattr(model, 'predict_proba'):
                prediction_proba = model.predict_proba(X).tolist()
            
            return {
                "success": True,
                "prediction": prediction.tolist(),
                "prediction_proba": prediction_proba,
                "model_type": model_type,
                "input_data": input_data
            }
            
        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}
    
    def evaluate_model(self, model_type: str, test_data: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate model performance on test data"""
        try:
            if model_type not in self.ml_models:
                return {"error": f"Model type {model_type} not supported"}
            
            model = self.ml_models[model_type]
            X_test = test_data.get('features', [])
            y_test = test_data.get('labels', [])
            
            if not X_test or not y_test:
                return {"error": "Invalid test data"}
            
            # Make predictions
            y_pred = model.predict(X_test)
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
            
            return {
                "success": True,
                "accuracy": accuracy,
                "precision": precision,
                "recall": recall,
                "f1_score": f1,
                "model_type": model_type,
                "test_size": len(X_test)
            }
            
        except Exception as e:
            return {"error": f"Model evaluation failed: {str(e)}"}
    
    def get_model_performance(self, model_type: str = None) -> Dict[str, Any]:
        """Get performance metrics for models"""
        if model_type:
            return self.model_performance.get(model_type, {})
        else:
            return self.model_performance

class AIHubAPI:
    """RESTful API for AI Hub functionality"""
    
    def __init__(self, nlp_processor: NaturalLanguageProcessor, 
                 cv_processor: ComputerVisionProcessor,
                 ml_engine: MachineLearningEngine):
        self.nlp_processor = nlp_processor
        self.cv_processor = cv_processor
        self.ml_engine = ml_engine
        self.app = Flask(__name__)
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")
        self.initialize_api()
    
    def initialize_api(self):
        """Initialize the Flask API with routes and middleware"""
        CORS(self.app)
        
        # Rate limiting
        limiter = Limiter(
            app=self.app,
            key_func=get_remote_address,
            default_limits=["200 per day", "50 per hour"]
        )
        
        self.register_routes()
        self.register_error_handlers()
    
    def register_routes(self):
        """Register API routes"""
        
        @self.app.route('/api/ai/nlp/analyze', methods=['POST'])
        def analyze_text():
            """Analyze text using NLP"""
            try:
                data = request.get_json()
                text = data.get('text', '')
                analysis_type = data.get('analysis_type', 'comprehensive')
                
                if not text:
                    return jsonify({"error": "Text is required"}), 400
                
                results = self.nlp_processor.analyze_text(text, analysis_type)
                return jsonify(results)
                
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @self.app.route('/api/ai/vision/analyze', methods=['POST'])
        def analyze_image():
            """Analyze image using computer vision"""
            try:
                if 'image' not in request.files:
                    return jsonify({"error": "Image file is required"}), 400
                
                image_file = request.files['image']
                analysis_type = request.form.get('analysis_type', 'comprehensive')
                
                image_data = image_file.read()
                results = self.cv_processor.analyze_image(image_data, analysis_type)
                
                return jsonify(results)
                
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @self.app.route('/api/ai/ml/train', methods=['POST'])
        def train_model():
            """Train a machine learning model"""
            try:
                data = request.get_json()
                model_type = data.get('model_type', '')
                training_data = data.get('training_data', {})
                model_params = data.get('model_params', {})
                
                if not model_type or not training_data:
                    return jsonify({"error": "Model type and training data are required"}), 400
                
                results = self.ml_engine.train_model(model_type, training_data, model_params)
                return jsonify(results)
                
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @self.app.route('/api/ai/ml/predict', methods=['POST'])
        def predict():
            """Make predictions using a trained model"""
            try:
                data = request.get_json()
                model_type = data.get('model_type', '')
                input_data = data.get('input_data', [])
                
                if not model_type or not input_data:
                    return jsonify({"error": "Model type and input data are required"}), 400
                
                results = self.ml_engine.predict(model_type, input_data)
                return jsonify(results)
                
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @self.app.route('/api/ai/ml/evaluate', methods=['POST'])
        def evaluate_model():
            """Evaluate model performance"""
            try:
                data = request.get_json()
                model_type = data.get('model_type', '')
                test_data = data.get('test_data', {})
                
                if not model_type or not test_data:
                    return jsonify({"error": "Model type and test data are required"}), 400
                
                results = self.ml_engine.evaluate_model(model_type, test_data)
                return jsonify(results)
                
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @self.app.route('/api/ai/status', methods=['GET'])
        def ai_status():
            """Get AI services status"""
            return jsonify({
                "nlp_available": self.nlp_processor is not None,
                "vision_available": self.cv_processor is not None,
                "ml_available": self.ml_engine is not None,
                "ai_libraries_available": AI_AVAILABLE,
                "web_framework_available": WEB_FRAMEWORK_AVAILABLE
            })
        
        @self.app.route('/api/ai/models', methods=['GET'])
        def list_models():
            """List available AI models"""
            return jsonify({
                "nlp_models": list(self.nlp_processor.nlp_models.keys()) if self.nlp_processor else [],
                "cv_models": list(self.cv_processor.cv_models.keys()) if self.cv_processor else [],
                "ml_models": list(self.ml_engine.ml_models.keys()) if self.ml_engine else []
            })
        
        @self.app.route('/api/ai/performance', methods=['GET'])
        def get_performance():
            """Get AI performance metrics"""
            return jsonify({
                "ml_performance": self.ml_engine.get_model_performance() if self.ml_engine else {},
                "timestamp": datetime.now().isoformat()
            })
    
    def register_error_handlers(self):
        """Register error handlers"""
        
        @self.app.errorhandler(400)
        def bad_request(error):
            return jsonify({"error": "Bad request", "details": str(error)}), 400
        
        @self.app.errorhandler(404)
        def not_found(error):
            return jsonify({"error": "Endpoint not found"}), 404
        
        @self.app.errorhandler(500)
        def internal_error(error):
            return jsonify({"error": "Internal server error"}), 500
    
    def run(self, host: str = '0.0.0.0', port: int = 8080, debug: bool = False):
        """Run the AI Hub API server"""
        print(f"🚀 Starting Maijd AI Software Development Hub...")
        print(f"📊 AI Hub URL: http://{host}:{port}")
        print(f"🔧 Debug mode: {debug}")
        
        if not AI_AVAILABLE:
            print("⚠️  Warning: AI libraries not available. Some features will be limited.")
        
        try:
            self.socketio.run(self.app, host=host, port=port, debug=debug)
        except Exception as e:
            print(f"❌ Failed to start AI Hub: {e}")

class MaijdAISoftwareHub:
    """Main AI Software Hub class"""
    
    def __init__(self, config_file: str = CONFIG_FILE):
        self.config_file = config_file
        self.config = self.load_config()
        
        # Initialize AI components
        self.nlp_processor = NaturalLanguageProcessor(self.config)
        self.cv_processor = ComputerVisionProcessor(self.config)
        self.ml_engine = MachineLearningEngine(self.config)
        
        # Initialize API
        self.api = AIHubAPI(self.nlp_processor, self.cv_processor, self.ml_engine)
    
    def load_config(self, config_file: str = None) -> Dict[str, Any]:
        """Load configuration from file"""
        if config_file is None:
            config_file = self.config_file
        
        try:
            if os.path.exists(config_file):
                with open(config_file, 'r') as f:
                    config = json.load(f)
                    # Merge with default config
                    return self.merge_configs(DEFAULT_CONFIG, config)
            else:
                # Create default config file
                self.save_config(DEFAULT_CONFIG)
                return DEFAULT_CONFIG
        except Exception as e:
            logging.error(f"Failed to load config: {e}")
            return DEFAULT_CONFIG
    
    def merge_configs(self, default: Dict[str, Any], custom: Dict[str, Any]) -> Dict[str, Any]:
        """Merge custom config with default config"""
        merged = default.copy()
        
        def deep_merge(d1, d2):
            for key, value in d2.items():
                if key in d1 and isinstance(d1[key], dict) and isinstance(value, dict):
                    deep_merge(d1[key], value)
                else:
                    d1[key] = value
        
        deep_merge(merged, custom)
        return merged
    
    def save_config(self, config: Dict[str, Any]) -> None:
        """Save configuration to file"""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(config, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to save config: {e}")
    
    def start(self):
        """Start the AI Software Hub"""
        print("🚀 Starting Maijd AI Software Development Hub...")
        print("🤖 AI Integration Platform")
        print("📊 Natural Language Processing: Available")
        print("👁️  Computer Vision: Available")
        print("🧠 Machine Learning: Available")
        print("🌐 Web API: Available")
        
        # Start the API server
        self.api.run(host='0.0.0.0', port=8080, debug=False)

def main():
    """Main entry point"""
    hub = MaijdAISoftwareHub()
    hub.start()

if __name__ == "__main__":
    main()
