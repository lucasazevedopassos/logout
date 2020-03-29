# Logout

## Description

It's a Node script to automate some stuffs using the Palo's Alto API.

You can:
  - See a group membership (AD group listed on the firewall)
  - See the current GP VPN Users
  - Disconnect a single user from the GP VPN
  - Disconnect a intersection between a specific group and the current VPN users
  - Generate the API Key
  
###Installing

1. Copy the directory to your local machine with NPM and Node installed

2. Use '**npm install**' to install the dependences *(only 3 packages)*


### Using the CLI

###### Checking the current VPN users:

**Example**

  node ./app.js check-vpn --firewall "192.168.1.1" --key HUDSAHUDS1231UDSAD=
  
###### Checking the group members:

**Example**

  node ./app.js check-group --firewall "192.168.1.1" --group jtss\group --key HUDSAHUDS1231UDSAD=

###### Disconnect the group members from the VPN:

**Example**

  node ./app.js disconnect-all --firewall "192.168.1.1" --group jtss\group --key HUDSAHUDS1231UDSAD=
  
###### Disconnect a single user:

**Example**

  node ./app.js disconnect-all --firewall "192.168.1.1" --username lucas --computer LAPTOP01 --key HUDSAHUDS1231UDSAD=
  
  
