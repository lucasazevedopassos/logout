var helper = require('./lib/helpers');
var yargs = require('yargs');
var chalk = require('chalk');

var error = chalk.bold.red;
var log = console.log;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

// Create check vpn command
yargs.command({
    command: 'check-vpn',
    describe: 'Check the current users connected on the VPN',
    builder: {
        key: {
            describe: 'Key to authenticate against the firewall',
            demandOption: true,
            type: 'string'
        },
        firewall: {
            describe: 'Firewall which you want check!',
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        helper.getVPNList(argv.firewall, argv.key, (err, VPNData) => {
            if(!err) {
                log(chalk.bgGray('\n\n--- Active ' + chalk.bold('VPN') + ' Users ---\n'));
                log('Number of active VPN users: ' + chalk.bold(VPNData.length) + '\n')
                    VPNData.forEach((user, index)=>{
                        index+=1
                        log('' + chalk.cyan(index + ') ') + chalk.bold(user.user));
                        log('   Computer: ' + chalk.bold(user.computer));
                        log('   Public IP: ' + chalk.bold(user['public-ip']));
                        log('   Client: ' + chalk.bold(user['client']));
                        log('   Login time: ' + chalk.bold(user['login-time']));
                    });
            } else {
                console.log(err)
            }
        });
    }
})

// Create check command
yargs.command({
    command: 'check-group',
    describe: 'Check a specific group members',
    builder: {
        key: {
            describe: 'Key to authenticate against the firewall',
            demandOption: true,
            type: 'string'
        },
        firewall: {
            describe: 'Firewall which you want check!',
            demandOption: true,
            type: 'string'
        },
        group: {
            describe: 'Group to check',
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        helper.getMember(argv.firewall, argv.group, argv.key, (err, ADData) => {
            if(!err) {
                console.log(ADData)
            } else {
                console.log(err)
            }
        });
    }
})

// Create check command
yargs.command({
    command: 'disconnect-all',
    describe: 'Disconnect users in a specific group',
    builder: {
        key: {
            describe: 'Key to authenticate against the firewall',
            demandOption: true,
            type: 'string'
        },
        firewall: {
            describe: 'Firewall which you want check!',
            demandOption: true,
            type: 'string'
        },
        group: {
            describe: 'Group you want to check',
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        helper.getMember(argv.firewall,argv.group,argv.key, (err, ADdata) => {
            if(!err) {
                helper.getVPNList(argv.firewall,argv.key, (err, VPNdata) => {
                    if(!err) {
                        var filtered = VPNdata.filter(x => ADdata.includes(x.user))
                        if(filtered.lenght > 0) {
                            filtered.forEach((user)=>{
                                helper.disconnect(argv.firewall,user.primaryusername.value,user.computer.value,key, (err, logData) =>{
                                    if(!err){
                                        console.log(logData)
                                    } else {
                                        console.log(logData)
                                    }
                                });
                            });
                        } else {
                            log(chalk.cyan('No users found to disconnect!'))
                        }
                        
                    } else {
                        console.log(VPNdata)
                    }
                });
            } else {
                console.log(ADdata)
            }
        });
    }
})

// Create check command
yargs.command({
    command: 'disconnect',
    describe: 'Disconnect a single user in VPN',
    builder: {
        key: {
            describe: 'Key to authenticate against the firewall',
            demandOption: true,
            type: 'string'
        },
        firewall: {
            describe: 'Firewall which you want check!',
            demandOption: true,
            type: 'string'
        },
        username: {
            describe: 'User you want to disconnect',
            demandOption: true,
            type: 'string'
        },
        computer: {
            describe: 'User computer you want to disconnect',
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        helper.disconnect(argv.firewall,argv.username, argv.computer, argv.key, (err, disData) =>{
            if(!err){
                console.log(disData)
            } else {
                console.log(disData)
            }
        });
    }
})

// Create check command
yargs.command({
    command: 'keygen',
    describe: 'Generate API Key',
    builder: {
        firewall: {
            describe: 'Firewall which you want to generate the Key!',
            demandOption: true,
            type: 'string'
        },
        username: {
            describe: 'Username to authenticate',
            demandOption: true,
            type: 'string'
        },
        password: {
            describe: 'Password for the user',
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        helper.keyGen(argv.firewall,argv.username, argv.password, (err, keyData) =>{
            if(!err){
                console.log(keyData)
            } else {
                console.log(keyData)
            }
        });
    }
})




yargs.parse()