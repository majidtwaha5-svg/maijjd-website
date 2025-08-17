#!/usr/bin/env python3
"""
Maijd Scientific Suite - Advanced Scientific Computing Platform
Comprehensive scientific computing, mathematical modeling, and research tools
"""

import os
import sys
import json
import time
import logging
import threading
import asyncio
import math
import statistics
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union, Tuple, Callable
from dataclasses import dataclass, asdict
from pathlib import Path
import hashlib
import secrets
import csv
import sqlite3
import pickle
import base64

# Scientific computing imports
try:
    import numpy as np
    import pandas as pd
    import matplotlib.pyplot as plt
    import seaborn as sns
    from scipy import stats, optimize, interpolate, signal
    from scipy.spatial import distance
    from scipy.linalg import solve, eig, svd
    import sympy as sp
    from sklearn import linear_model, cluster, metrics, preprocessing
    from sklearn.decomposition import PCA
    from sklearn.ensemble import RandomForestClassifier
    import plotly.graph_objects as go
    import plotly.express as px
    SCIENTIFIC_AVAILABLE = True
except ImportError:
    SCIENTIFIC_AVAILABLE = False
    print("Scientific libraries not available. Install with: pip install numpy pandas matplotlib seaborn scipy sympy scikit-learn plotly")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ScientificDataset:
    """Scientific dataset definition"""
    dataset_id: str
    name: str
    description: str
    data_type: str  # numerical, categorical, mixed, time_series
    dimensions: Tuple[int, int]  # rows, columns
    features: List[str]
    target_variable: Optional[str]
    created_at: datetime
    last_modified: datetime
    source: str
    metadata: Dict[str, Any]

@dataclass
class MathematicalModel:
    """Mathematical model definition"""
    model_id: str
    name: str
    model_type: str  # linear, polynomial, exponential, neural_network
    parameters: Dict[str, float]
    equation: str
    accuracy: float
    created_at: datetime
    training_data: str
    validation_data: str
    features_used: List[str]

@dataclass
class ResearchProject:
    """Research project definition"""
    project_id: str
    title: str
    description: str
    objectives: List[str]
    methodology: str
    datasets: List[str]
    models: List[str]
    results: Dict[str, Any]
    status: str  # planning, active, completed, published
    created_at: datetime
    updated_at: datetime
    researchers: List[str]

class MaijdScientificSuite:
    """
    Advanced scientific computing suite with comprehensive research tools
    """
    
    def __init__(self):
        self.version = "2024.1.0"
        self.suite_type = "scientific"
        self.architecture = "multi_platform"
        self.features = [
            "Mathematical modeling",
            "Statistical analysis",
            "Data visualization",
            "Machine learning",
            "Numerical computing",
            "Symbolic mathematics",
            "Signal processing",
            "Optimization algorithms",
            "Time series analysis",
            "Clustering algorithms",
            "Regression analysis",
            "Hypothesis testing",
            "Data preprocessing",
            "Model validation",
            "Research collaboration"
        ]
        
        self.datasets: Dict[str, ScientificDataset] = {}
        self.models: Dict[str, MathematicalModel] = {}
        self.research_projects: Dict[str, ResearchProject] = {}
        self.analysis_tools = {}
        self.visualization_tools = {}
        
        # Initialize scientific computing environment
        self.initialize_scientific_environment()
        
        # Initialize analysis tools
        self.initialize_analysis_tools()
        
        # Initialize visualization tools
        self.initialize_visualization_tools()
        
        logger.info("Maijd Scientific Suite initialized successfully")
    
    def initialize_scientific_environment(self):
        """Initialize the scientific computing environment"""
        if not SCIENTIFIC_AVAILABLE:
            logger.warning("Scientific libraries not available. Some features will be limited.")
            return
        
        logger.info("Initializing scientific computing environment...")
        
        # Set matplotlib backend for non-interactive environments
        plt.switch_backend('Agg')
        
        # Configure pandas display options
        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', None)
        
        # Configure numpy random seed for reproducibility
        np.random.seed(42)
        
        logger.info("Scientific computing environment initialized")
    
    def initialize_analysis_tools(self):
        """Initialize analysis tools"""
        self.analysis_tools = {
            'statistical': self._statistical_analysis,
            'mathematical': self._mathematical_analysis,
            'machine_learning': self._machine_learning_analysis,
            'optimization': self._optimization_analysis,
            'signal_processing': self._signal_processing_analysis
        }
    
    def initialize_visualization_tools(self):
        """Initialize visualization tools"""
        self.visualization_tools = {
            'charts': self._create_charts,
            'plots': self._create_plots,
            'heatmaps': self._create_heatmaps,
            '3d_visualizations': self._create_3d_visualizations,
            'interactive_plots': self._create_interactive_plots
        }
    
    def create_dataset(self, name: str, data: Union[np.ndarray, pd.DataFrame, List], 
                      description: str = "", data_type: str = "numerical") -> str:
        """Create a new scientific dataset"""
        dataset_id = str(secrets.token_hex(8))
        
        if isinstance(data, list):
            data = np.array(data)
        elif isinstance(data, pd.DataFrame):
            data = data.values
            features = list(data.columns)
        else:
            features = [f"feature_{i}" for i in range(data.shape[1])]
        
        dimensions = data.shape
        target_variable = None
        
        dataset = ScientificDataset(
            dataset_id=dataset_id,
            name=name,
            description=description,
            data_type=data_type,
            dimensions=dimensions,
            features=features,
            target_variable=target_variable,
            created_at=datetime.now(),
            last_modified=datetime.now(),
            source="generated",
            metadata={
                'data_type': str(type(data)),
                'shape': dimensions,
                'dtype': str(data.dtype) if hasattr(data, 'dtype') else 'unknown'
            }
        )
        
        self.datasets[dataset_id] = dataset
        
        # Store the actual data
        dataset.metadata['data'] = data
        
        logger.info(f"Created dataset: {name} with dimensions {dimensions}")
        
        return dataset_id
    
    def load_dataset_from_file(self, file_path: str, dataset_name: str = None) -> str:
        """Load dataset from file (CSV, Excel, etc.)"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if not SCIENTIFIC_AVAILABLE:
            raise ImportError("Scientific libraries required for file loading")
        
        file_extension = Path(file_path).suffix.lower()
        
        try:
            if file_extension == '.csv':
                data = pd.read_csv(file_path)
            elif file_extension in ['.xlsx', '.xls']:
                data = pd.read_excel(file_path)
            elif file_extension == '.json':
                data = pd.read_json(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
            
            dataset_name = dataset_name or Path(file_path).stem
            return self.create_dataset(dataset_name, data, f"Loaded from {file_path}")
            
        except Exception as e:
            logger.error(f"Error loading dataset from {file_path}: {e}")
            raise
    
    def create_mathematical_model(self, name: str, model_type: str, 
                                training_data_id: str, features: List[str]) -> str:
        """Create a new mathematical model"""
        model_id = str(secrets.token_hex(8))
        
        if training_data_id not in self.datasets:
            raise ValueError("Training dataset not found")
        
        training_data = self.datasets[training_data_id]
        data = training_data.metadata['data']
        
        # Create model based on type
        if model_type == 'linear':
            model, equation, accuracy = self._create_linear_model(data, features)
        elif model_type == 'polynomial':
            model, equation, accuracy = self._create_polynomial_model(data, features)
        elif model_type == 'exponential':
            model, equation, accuracy = self._create_exponential_model(data, features)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        mathematical_model = MathematicalModel(
            model_id=model_id,
            name=name,
            model_type=model_type,
            parameters=model,
            equation=equation,
            accuracy=accuracy,
            created_at=datetime.now(),
            training_data=training_data_id,
            validation_data="",
            features_used=features
        )
        
        self.models[model_id] = mathematical_model
        
        logger.info(f"Created {model_type} model: {name} with accuracy {accuracy:.4f}")
        
        return model_id
    
    def _create_linear_model(self, data: np.ndarray, features: List[str]) -> Tuple[Dict, str, float]:
        """Create a linear regression model"""
        if not SCIENTIFIC_AVAILABLE:
            return {}, "y = ax + b", 0.0
        
        try:
            # Prepare data
            X = data[:, :-1]  # Features
            y = data[:, -1]   # Target
            
            # Fit linear regression
            reg = linear_model.LinearRegression()
            reg.fit(X, y)
            
            # Create equation string
            equation = "y = "
            for i, feature in enumerate(features[:-1]):
                equation += f"{reg.coef_[i]:.4f}*{feature} + "
            equation += f"{reg.intercept_:.4f}"
            
            # Calculate accuracy (R² score)
            accuracy = reg.score(X, y)
            
            # Store model parameters
            model_params = {
                'coefficients': reg.coef_.tolist(),
                'intercept': reg.intercept_,
                'feature_names': features[:-1]
            }
            
            return model_params, equation, accuracy
            
        except Exception as e:
            logger.error(f"Error creating linear model: {e}")
            return {}, "y = ax + b", 0.0
    
    def _create_polynomial_model(self, data: np.ndarray, features: List[str]) -> Tuple[Dict, str, float]:
        """Create a polynomial regression model"""
        if not SCIENTIFIC_AVAILABLE:
            return {}, "y = ax² + bx + c", 0.0
        
        try:
            # Prepare data
            X = data[:, :-1]
            y = data[:, -1]
            
            # Create polynomial features
            poly = preprocessing.PolynomialFeatures(degree=2)
            X_poly = poly.fit_transform(X)
            
            # Fit polynomial regression
            reg = linear_model.LinearRegression()
            reg.fit(X_poly, y)
            
            # Create equation string
            equation = "y = polynomial_function(x)"
            
            # Calculate accuracy
            accuracy = reg.score(X_poly, y)
            
            # Store model parameters
            model_params = {
                'coefficients': reg.coef_.tolist(),
                'intercept': reg.intercept_,
                'polynomial_degree': 2,
                'feature_names': features[:-1]
            }
            
            return model_params, equation, accuracy
            
        except Exception as e:
            logger.error(f"Error creating polynomial model: {e}")
            return {}, "y = ax² + bx + c", 0.0
    
    def _create_exponential_model(self, data: np.ndarray, features: List[str]) -> Tuple[Dict, str, float]:
        """Create an exponential regression model"""
        if not SCIENTIFIC_AVAILABLE:
            return {}, "y = ae^(bx)", 0.0
        
        try:
            # Prepare data
            X = data[:, :-1]
            y = data[:, -1]
            
            # Fit exponential model using log transformation
            y_log = np.log(np.abs(y) + 1e-10)  # Add small value to avoid log(0)
            
            reg = linear_model.LinearRegression()
            reg.fit(X, y_log)
            
            # Create equation string
            equation = f"y = {np.exp(reg.intercept_):.4f} * e^({reg.coef_[0]:.4f}*x)"
            
            # Calculate accuracy
            y_pred = np.exp(reg.predict(X))
            accuracy = 1 - np.mean((y - y_pred) ** 2) / np.var(y)
            
            # Store model parameters
            model_params = {
                'coefficient': reg.coef_[0],
                'intercept': reg.intercept_,
                'base': np.exp(reg.intercept_),
                'feature_names': features[:-1]
            }
            
            return model_params, equation, accuracy
            
        except Exception as e:
            logger.error(f"Error creating exponential model: {e}")
            return {}, "y = ae^(bx)", 0.0
    
    def perform_statistical_analysis(self, dataset_id: str) -> Dict[str, Any]:
        """Perform comprehensive statistical analysis on a dataset"""
        if dataset_id not in self.datasets:
            return {'error': 'Dataset not found'}
        
        dataset = self.datasets[dataset_id]
        data = dataset.metadata['data']
        
        if not SCIENTIFIC_AVAILABLE:
            return {'error': 'Scientific libraries not available'}
        
        try:
            analysis_results = {}
            
            # Basic statistics
            analysis_results['basic_stats'] = {
                'mean': np.mean(data, axis=0).tolist(),
                'median': np.median(data, axis=0).tolist(),
                'std': np.std(data, axis=0).tolist(),
                'min': np.min(data, axis=0).tolist(),
                'max': np.max(data, axis=0).tolist(),
                'count': data.shape[0]
            }
            
            # Correlation analysis
            if data.shape[1] > 1:
                correlation_matrix = np.corrcoef(data.T)
                analysis_results['correlation'] = {
                    'matrix': correlation_matrix.tolist(),
                    'features': dataset.features
                }
            
            # Distribution analysis
            analysis_results['distributions'] = {}
            for i, feature in enumerate(dataset.features):
                feature_data = data[:, i]
                analysis_results['distributions'][feature] = {
                    'skewness': stats.skew(feature_data),
                    'kurtosis': stats.kurtosis(feature_data),
                    'normality_test': stats.normaltest(feature_data)
                }
            
            # Outlier detection
            analysis_results['outliers'] = {}
            for i, feature in enumerate(dataset.features):
                feature_data = data[:, i]
                Q1 = np.percentile(feature_data, 25)
                Q3 = np.percentile(feature_data, 75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                outliers = np.where((feature_data < lower_bound) | (feature_data > upper_bound))[0]
                analysis_results['outliers'][feature] = {
                    'count': len(outliers),
                    'indices': outliers.tolist(),
                    'lower_bound': lower_bound,
                    'upper_bound': upper_bound
                }
            
            return analysis_results
            
        except Exception as e:
            logger.error(f"Error in statistical analysis: {e}")
            return {'error': str(e)}
    
    def create_research_project(self, title: str, description: str, objectives: List[str]) -> str:
        """Create a new research project"""
        project_id = str(secrets.token_hex(8))
        
        project = ResearchProject(
            project_id=project_id,
            title=title,
            description=description,
            objectives=objectives,
            methodology="",
            datasets=[],
            models=[],
            results={},
            status="planning",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            researchers=[]
        )
        
        self.research_projects[project_id] = project
        
        logger.info(f"Created research project: {title}")
        
        return project_id
    
    def add_dataset_to_project(self, project_id: str, dataset_id: str) -> bool:
        """Add a dataset to a research project"""
        if project_id not in self.research_projects:
            return False
        
        if dataset_id not in self.datasets:
            return False
        
        project = self.research_projects[project_id]
        if dataset_id not in project.datasets:
            project.datasets.append(dataset_id)
            project.updated_at = datetime.now()
            logger.info(f"Added dataset to project: {project.title}")
        
        return True
    
    def add_model_to_project(self, project_id: str, model_id: str) -> bool:
        """Add a model to a research project"""
        if project_id not in self.research_projects:
            return False
        
        if model_id not in self.models:
            return False
        
        project = self.research_projects[project_id]
        if model_id not in project.models:
            project.models.append(model_id)
            project.updated_at = datetime.now()
            logger.info(f"Added model to project: {project.title}")
        
        return True
    
    def generate_visualization(self, dataset_id: str, viz_type: str = "charts", **kwargs) -> str:
        """Generate data visualization"""
        if dataset_id not in self.datasets:
            return "Dataset not found"
        
        if viz_type not in self.visualization_tools:
            return f"Unsupported visualization type: {viz_type}"
        
        try:
            return self.visualization_tools[viz_type](dataset_id, **kwargs)
        except Exception as e:
            logger.error(f"Error generating visualization: {e}")
            return f"Error: {str(e)}"
    
    def _create_charts(self, dataset_id: str, **kwargs) -> str:
        """Create basic charts"""
        if not SCIENTIFIC_AVAILABLE:
            return "Scientific libraries not available"
        
        dataset = self.datasets[dataset_id]
        data = dataset.metadata['data']
        
        try:
            # Create a simple line chart
            plt.figure(figsize=(10, 6))
            plt.plot(data[:, 0], data[:, 1] if data.shape[1] > 1 else data[:, 0])
            plt.title(f"Chart: {dataset.name}")
            plt.xlabel(dataset.features[0])
            plt.ylabel(dataset.features[1] if data.shape[1] > 1 else "Value")
            plt.grid(True)
            
            # Save chart
            chart_path = f"chart_{dataset_id}.png"
            plt.savefig(chart_path)
            plt.close()
            
            return f"Chart saved to {chart_path}"
            
        except Exception as e:
            return f"Error creating chart: {str(e)}"
    
    def _create_plots(self, dataset_id: str, **kwargs) -> str:
        """Create various plot types"""
        if not SCIENTIFIC_AVAILABLE:
            return "Scientific libraries not available"
        
        dataset = self.datasets[dataset_id]
        data = dataset.metadata['data']
        
        try:
            # Create subplots
            fig, axes = plt.subplots(2, 2, figsize=(12, 10))
            fig.suptitle(f"Plots: {dataset.name}")
            
            # Histogram
            axes[0, 0].hist(data[:, 0], bins=20, alpha=0.7)
            axes[0, 0].set_title("Histogram")
            axes[0, 0].set_xlabel(dataset.features[0])
            
            # Scatter plot
            if data.shape[1] > 1:
                axes[0, 1].scatter(data[:, 0], data[:, 1], alpha=0.6)
                axes[0, 1].set_title("Scatter Plot")
                axes[0, 1].set_xlabel(dataset.features[0])
                axes[0, 1].set_ylabel(dataset.features[1])
            
            # Box plot
            axes[1, 0].boxplot(data)
            axes[1, 0].set_title("Box Plot")
            axes[1, 0].set_xticklabels(dataset.features, rotation=45)
            
            # Line plot
            axes[1, 1].plot(data[:100, 0])  # First 100 points
            axes[1, 1].set_title("Line Plot (First 100 points)")
            axes[1, 1].set_xlabel("Index")
            axes[1, 1].set_ylabel(dataset.features[0])
            
            plt.tight_layout()
            
            # Save plots
            plot_path = f"plots_{dataset_id}.png"
            plt.savefig(plot_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            return f"Plots saved to {plot_path}"
            
        except Exception as e:
            return f"Error creating plots: {str(e)}"
    
    def _create_heatmaps(self, dataset_id: str, **kwargs) -> str:
        """Create correlation heatmaps"""
        if not SCIENTIFIC_AVAILABLE:
            return "Scientific libraries not available"
        
        dataset = self.datasets[dataset_id]
        data = dataset.metadata['data']
        
        try:
            if data.shape[1] < 2:
                return "Need at least 2 features for heatmap"
            
            # Calculate correlation matrix
            correlation_matrix = np.corrcoef(data.T)
            
            # Create heatmap
            plt.figure(figsize=(10, 8))
            sns.heatmap(correlation_matrix, 
                       annot=True, 
                       cmap='coolwarm', 
                       center=0,
                       xticklabels=dataset.features,
                       yticklabels=dataset.features)
            plt.title(f"Correlation Heatmap: {dataset.name}")
            
            # Save heatmap
            heatmap_path = f"heatmap_{dataset_id}.png"
            plt.savefig(heatmap_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            return f"Heatmap saved to {heatmap_path}"
            
        except Exception as e:
            return f"Error creating heatmap: {str(e)}"
    
    def _create_3d_visualizations(self, dataset_id: str, **kwargs) -> str:
        """Create 3D visualizations"""
        if not SCIENTIFIC_AVAILABLE:
            return "Scientific libraries not available"
        
        dataset = self.datasets[dataset_id]
        data = dataset.metadata['data']
        
        try:
            if data.shape[1] < 3:
                return "Need at least 3 features for 3D visualization"
            
            # Create 3D scatter plot
            fig = plt.figure(figsize=(10, 8))
            ax = fig.add_subplot(111, projection='3d')
            
            scatter = ax.scatter(data[:, 0], data[:, 1], data[:, 2], 
                               c=data[:, 2], cmap='viridis', alpha=0.6)
            
            ax.set_xlabel(dataset.features[0])
            ax.set_ylabel(dataset.features[1])
            ax.set_zlabel(dataset.features[2])
            ax.set_title(f"3D Scatter Plot: {dataset.name}")
            
            # Add colorbar
            fig.colorbar(scatter)
            
            # Save 3D plot
            plot3d_path = f"3d_plot_{dataset_id}.png"
            plt.savefig(plot3d_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            return f"3D plot saved to {plot3d_path}"
            
        except Exception as e:
            return f"Error creating 3D visualization: {str(e)}"
    
    def _create_interactive_plots(self, dataset_id: str, **kwargs) -> str:
        """Create interactive plots using Plotly"""
        if not SCIENTIFIC_AVAILABLE:
            return "Scientific libraries not available"
        
        try:
            import plotly.graph_objects as go
            import plotly.express as px
        except ImportError:
            return "Plotly not available for interactive plots"
        
        dataset = self.datasets[dataset_id]
        data = dataset.metadata['data']
        
        try:
            if data.shape[1] < 2:
                return "Need at least 2 features for interactive plot"
            
            # Create interactive scatter plot
            fig = px.scatter(x=data[:, 0], y=data[:, 1], 
                           title=f"Interactive Plot: {dataset.name}",
                           labels={'x': dataset.features[0], 'y': dataset.features[1]})
            
            # Save interactive plot
            plot_path = f"interactive_plot_{dataset_id}.html"
            fig.write_html(plot_path)
            
            return f"Interactive plot saved to {plot_path}"
            
        except Exception as e:
            return f"Error creating interactive plot: {str(e)}"
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        return {
            'suite_info': {
                'name': 'Maijd Scientific Suite',
                'version': self.version,
                'type': self.suite_type,
                'architecture': self.architecture
            },
            'statistics': {
                'datasets': len(self.datasets),
                'models': len(self.models),
                'research_projects': len(self.research_projects),
                'analysis_tools': len(self.analysis_tools),
                'visualization_tools': len(self.visualization_tools)
            },
            'features': self.features,
            'scientific_libraries': SCIENTIFIC_AVAILABLE
        }
    
    def export_results(self, project_id: str, format: str = "json") -> str:
        """Export research project results"""
        if project_id not in self.research_projects:
            return "Project not found"
        
        project = self.research_projects[project_id]
        
        try:
            if format == "json":
                export_data = {
                    'project': asdict(project),
                    'datasets': {},
                    'models': {},
                    'analysis_results': {}
                }
                
                # Add dataset information
                for dataset_id in project.datasets:
                    if dataset_id in self.datasets:
                        dataset = self.datasets[dataset_id]
                        export_data['datasets'][dataset_id] = {
                            'name': dataset.name,
                            'description': dataset.description,
                            'dimensions': dataset.dimensions,
                            'features': dataset.features
                        }
                
                # Add model information
                for model_id in project.models:
                    if model_id in self.models:
                        model = self.models[model_id]
                        export_data['models'][model_id] = {
                            'name': model.name,
                            'type': model.model_type,
                            'accuracy': model.accuracy,
                            'equation': model.equation
                        }
                
                # Export to file
                export_path = f"project_{project_id}_export.json"
                with open(export_path, 'w') as f:
                    json.dump(export_data, f, indent=2, default=str)
                
                return f"Results exported to {export_path}"
            
            else:
                return f"Unsupported export format: {format}"
                
        except Exception as e:
            logger.error(f"Error exporting results: {e}")
            return f"Export error: {str(e)}"

def main():
    """Main function for testing"""
    print("🚀 Starting Maijd Scientific Suite...")
    
    # Create scientific suite instance
    scientific_suite = MaijdScientificSuite()
    
    # Generate sample data
    if SCIENTIFIC_AVAILABLE:
        # Create sample dataset
        np.random.seed(42)
        sample_data = np.random.randn(100, 3)
        sample_data[:, 2] = 2 * sample_data[:, 0] + 1.5 * sample_data[:, 1] + np.random.randn(100) * 0.1
        
        dataset_id = scientific_suite.create_dataset(
            name="Sample Research Data",
            data=sample_data,
            description="Sample dataset for testing scientific suite",
            data_type="numerical"
        )
        
        # Perform statistical analysis
        analysis_results = scientific_suite.perform_statistical_analysis(dataset_id)
        print(f"Statistical Analysis: {json.dumps(analysis_results, indent=2, default=str)}")
        
        # Create mathematical model
        model_id = scientific_suite.create_mathematical_model(
            name="Linear Regression Model",
            model_type="linear",
            training_data_id=dataset_id,
            features=["feature_0", "feature_1", "target"]
        )
        
        # Create research project
        project_id = scientific_suite.create_research_project(
            title="Sample Research Project",
            description="A sample research project to test the scientific suite",
            objectives=["Analyze data patterns", "Build predictive model", "Validate results"]
        )
        
        # Add dataset and model to project
        scientific_suite.add_dataset_to_project(project_id, dataset_id)
        scientific_suite.add_model_to_project(project_id, model_id)
        
        # Generate visualizations
        chart_result = scientific_suite.generate_visualization(dataset_id, "charts")
        plots_result = scientific_suite.generate_visualization(dataset_id, "plots")
        heatmap_result = scientific_suite.generate_visualization(dataset_id, "heatmaps")
        
        print(f"Chart generation: {chart_result}")
        print(f"Plots generation: {plots_result}")
        print(f"Heatmap generation: {heatmap_result}")
        
        # Export results
        export_result = scientific_suite.export_results(project_id)
        print(f"Export result: {export_result}")
    
    # Get system status
    status = scientific_suite.get_system_status()
    print(f"System Status: {json.dumps(status, indent=2, default=str)}")
    
    print("✅ Maijd Scientific Suite test completed")

if __name__ == "__main__":
    main()
