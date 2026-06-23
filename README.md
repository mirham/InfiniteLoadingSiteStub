# Infinite Loading Site Stub

A versatile, high-performance web site stub with an infinite scrolling feed, designed for various testing, scraping, or placeholder purposes. Built with a simple Node.js backend, this project allows you to rapidly deploy entirely customized stubs by modifying a configuration file and a media folder.

## Features

- Lightweight Node.js backend for fast page loads and minimal resource usage.
- Infinite scroll functionality supporting the progressive loading of media assets.
- Fully dynamic customization via a single configuration file.
- Support for custom media payloads (images, video, or animations).

## Directory Structure & Customization

You can change the entire identity of the stub in seconds using the configuration file and the media asset directory:

1. **`config.json`**: Use this file to define the site metadata, layout, and loading behavior.
   - Title and heading text
   - Favicon path
   - Background styling
   - Initial media count (loaded on page load)
   - Incremental media count (loaded on scroll)

2. **Media Folder**: Place any desired images, videos, or animations into this folder. The infinite scroll engine dynamically pulls from this directory during loading.

## Installation (Debian Linux)

Follow these steps to update your environment, install Node.js, manage the application process, and expose it via a reverse proxy.

### 1. Update the System
Ensure your system packages are up to date before installing dependencies:
```bash
sudo apt update && sudo apt upgrade -y
```
### 2. Install Node.js and verify the installation of both the runtime and the package manager:
```bash
sudo apt-get install nodejs -y
node -v
npm -v
```
### 3. Install PM2 Process Manager
Install PM2 globally to handle the execution lifecycle of your server process:
```bash
sudo npm install -g pm2
```
### 4. Start the Application
Launch the Node.js server using PM2 and assign it a reference name:
```bash
sudo pm2 start /var/www/stub/server.js --name "stub"
```
### 5. Configure Automatic Boot Persistence
To ensure the site stub restarts automatically after a system reboot, execute the following commands in sequence:
```bash
sudo pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
sudo pm2 save
```
### 6. Monitor and Logs
Check the status of the process or monitor live runtime output using these utility commands:
```bash
sudo pm2 status
sudo pm2 logs stub
```

## Example
<p align="left">
  <img src="https://github.com/mirham/InfiniteLoadingSiteStub/blob/main/example/Example.png" width="700">
</p>
