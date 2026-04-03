pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Pulls the latest code triggered by the GitHub webhook
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // Triggers the SonarScanner tool configured in Jenkins
                    def scannerHome = tool 'SonarScanner' 
                    withSonarQubeEnv('LocalSonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                // Runs the playbook using the inventory file
                sh 'ansible-playbook -i hosts.ini deploy.yml'
            }
        }
    }
}
