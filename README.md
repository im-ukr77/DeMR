# Decentralized Electronic Medical Record (DeMR) System using Hyperledger Fabric

You can find the webpage preview [here](https://im-ukr77.github.io/Decentralized-Electronic-Medical-Records-DeMR-System/)<br><br>
The content of this README.md file as per the following headers:<br><br>
<b>A. Introduction <br>
B. Installation <br>
C. Set-up <br>
D. Steps to successfully close and re-run the project <br>
E. Version Used <br></b>

## A. Introduction

This project marks a significant advancement by successfully integrating private blockchain technology into Electronic Health Records (EHRs). The primary objective is to enhance the security and interoperability of patient data through blockchain’s decentralized structure, ensuring data integrity and protection against unauthorized modifications.
This repository provides the necessary scripts and configurations for establishing a Hyperledger Fabric network and deploying chaincode.

## B. Installation
The following installations are preferred:
- Ubuntu 20.04+/ MacOS/ Ubuntu running on WSL2 (For Windows)
- Docker and WSL extension on Visual Studio Code
- Docker Desktop (If using WSL2 then ensure that *WSL integration with Ubuntu* is enabled under Docker desktop settings)
- Python 3 (for serving frontend via http.server)
- Node.js and nvm. (Check the versions mentioned at the end of this readme) <br>

(i) **Install NVM (Latest Version)**
 ```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
 ```
<br>(ii) **Reload Shell Configuration**
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```
<br>Alternatively, restart your terminal or run:
 ```bash
source ~/.bashrc  # or source ~/.zshrc if using Zsh
   ```
<br>(iii) **Install Required System Library**
```bash
sudo apt update
sudo apt install -y libatomic1
   ```
<br>(iv) **Install the Latest Node.js Version**
```bash
nvm install node
   ```
<br>(v) **Verify Installation**
```bash
node -v  # Check Node.js version
npm -v   # Check npm version
nvm -v   # Check NVM version
   ```
   
## C. Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/im-ukr77/DeMR.git
   ```
   Navigate into the project folder:
    ```bash
   cd DeMR
   ```
   And then run these command:
    ```bash
   curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
   chmod +x install-fabric.sh
   ./install-fabric.sh docker binary
   ```

3. **Navigate to the test network directory:**

   ```bash
   cd fabric-samples/test-network
   ```
   
5. **Execute the following commands to set up the network and deploy the chaincode:**

   ```bash
   ./network.sh down
   ./network.sh up createChannel -ca -s couchdb
   ./deploymentScript.sh
   ```
   
6. **After successful execution of step 3, navigate to the backend-combined directory:**

   ```bash
   cd backend-combined
   ```
   ```bash
   npm install nodemailer
   ```

7. **Enroll admin, register user, and start the application:**

   Before enrolling, run this command:
   ```bash
   npm install fabric-ca-client
   ```
   ```bash
   node enrollAdmin.js
   node registerUser.js
   node app.js
   ```

8. **To view Frontend**

   Open a new terminal and run these commands:
   ```bash
   cd DeMR/fabric-samples/test-network/frontend
   python3 -m http.server
   ```

## D. Steps to successfully close and re-run the project:
To close the project, stop the backend as well as frontend terminal and execute the following command in test-network directory:
   ```bash
   ./network.sh down
   ```
For running again, execute the following commands only as per their respective directories (mentioned earlier):
   ```bash
   ./network.sh up createChannel -ca -s couchdb
   ./deploymentScript.sh
   ```
   ```bash
   cd backend-combined
   ```
   ```bash
   node enrollAdmin.js
   node registerUser.js
   node app.js
   ```
To view frontend, open a new terminal and run these commands:
   ```bash
   cd DeMR/fabric-samples/test-network/frontend
   python3 -m http.server
   ```
## E. Used:
- Node v23.7.0 / v20.18.1
- npm v10.9.2 / v10.8.2
- nvm v0.39.5
- docker v27.4.0
