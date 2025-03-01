# 🚁 Autonomous Search and Rescue Drone System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/downloads/)
[![PyBullet](https://img.shields.io/badge/simulation-PyBullet-red)](https://pybullet.org)
[![Stable Baselines3](https://img.shields.io/badge/RL-StableBaselines3-orange)](https://stable-baselines3.readthedocs.io/)

## 📋 Overview

This project implements an autonomous multi-drone system for search and rescue operations using reinforcement learning. The system trains drone swarms to efficiently search areas, detect victims, and optimize rescue routes while maintaining optimal flight patterns. The project includes:

![Multi Drone Training](https://github.com/SaraffAbhishek/Autonomous-Search-and-Rescue-Drone/blob/e1a800a7aed0cd0b18775f1ce3a5e279343b5a83/assets/multi.png)

- A PyBullet-based simulation environment for training and testing drone behaviors
- Reinforcement learning models using PPO (Proximal Policy Optimization)
- A real-time monitoring dashboard for training visualization
- Field-of-view (FOV) visualization for drone perception
- Automated status reports with mission progress and rescue recommendations

## 🔍 Key Features

- **Multi-Drone Coordination**: Uses reinforcement learning to train swarms of drones to work cooperatively
- **Multi-sensor Fusion**: Integration of position, IMU, and coverage data
- **Victim Detection**: Autonomous identification of victims in the search area
- **Coverage Optimization**: Efficient exploration algorithms for maximum area coverage
- **Real-time Visualization**: Dashboard for monitoring training metrics and drone performance
- **Customizable FOV**: Adjustable field-of-view settings for different scenarios
- **Stability Control**: Maintains drone stability while optimizing search patterns
- **Automated Status Reports**: HTML email updates with mission progress and rescue recommendations
- **Rescue Route Optimization**: Automatically suggests optimal paths to reach detected victims

## 🧠 Technical Architecture

### System Components

1. **DroneSwarm**: Manages multiple drone agents, coordinates shared information, and assigns search areas
2. **MissionMonitor**: Tracks search coverage, victim locations, and mission statistics
3. **EmailMissionMonitor**: Extends monitoring with automated email status updates
4. **MultiDroneEnv**: PyBullet environment integrating physics simulation with RL training
5. **CustomFeatureExtractor**: Neural network architecture for processing complex input data
6. **PPO Implementation**: Deep reinforcement learning algorithm implementation

## 📊 Training Dashboard

The project includes a React-based dashboard for real-time monitoring of training progress with:

- **Interactive charts**: Visualize rewards, losses, and other metrics during training
- **Drone status monitoring**: Track position, battery levels, and performance
- **Training metrics**: Monitor episode length, victim discovery rate, and area coverage
- **Dark theme UI**: Modern and sleek interface for better visibility

![RL Dashboard](https://github.com/SaraffAbhishek/Autonomous-Search-and-Rescue-Drone/blob/e1a800a7aed0cd0b18775f1ce3a5e279343b5a83/assets/frontend.png)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SaraffAbhishek/Autonomous-Search-and-Rescue-Drone.git
   cd Autonomous-Search-and-Rescue-Drone/Drone-RL-Processing
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the dashboard**:
   ```bash
   cd RL_Training_FrontendReport
   npm install
   ```

5. **Configure email settings (optional)**:
   ```python
   # Update the email_config dictionary in the code
   email_config = {
       'sender_email': 'your_email@gmail.com',
       'sender_password': 'your_app_password',  # Use App Password for Gmail
       'recipient_email': 'recipient@example.com',
       'smtp_server': 'smtp.gmail.com',
       'smtp_port': 587,
       'use_tls': True,
       'interval': 30  # Email interval in minutes
   }
   ```

## 🚀 Usage

### Running the Simulation

```bash
# Run the simulation with FOV visualization
python singleDroneWithFOV.py

# Run the optimized single drone simulation
python singleDrone_final.py

# Run the multi-drone simulation
python fourDrones_final.py
```

### Starting the Dashboard

```bash
cd RL_Training_FrontendReport
npm start
```

Navigate to `http://localhost:3000` to view the dashboard.

### Reward Function

The drone's learning is guided by a carefully designed reward function:

- +10.0 points for each victim found
- +0.1 points for each new grid cell explored
- -0.1 * stability error (to encourage stable flight)
- -0.1 * altitude error (to maintain optimal height)

## 📊 Performance Metrics

The system tracks and reports several key performance metrics:

- **Coverage Percentage**: Percentage of the search area that has been explored
- **Search Speed**: Rate of new area coverage (percentage per minute)
- **Revisit Rate**: Percentage of already-visited areas that drones revisit (lower is better)
- **Victims Located**: Number and positions of all detected victims
- **Search Efficiency**: Evaluation of search pattern effectiveness
- **Mission Duration**: Total time elapsed since mission start

## 🌐 Email Notification System

The system can send rich HTML emails with mission updates including:
- Mission duration and coverage statistics
- Human detection details with timestamps
- Optimized rescue routes
- Visualizations of search patterns
