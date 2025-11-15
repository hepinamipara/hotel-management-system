
pipeline {
    agent any
    stages {
        stage('Pull Code') {
            steps {
                echo "Pulling latest code..."
                sh 'git --version'
            }
        }
        stage('Build') {
            steps {
                echo "Building project...."
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying application..."
            }
        }
    }
}
