# manly_lamp
Chris Manly's LAMP server for SE and partner SE training

## This script has been tested only with UDF image "Ubuntu 16.04 LTS Server – 2018-Jan-23"
## DO NOT FORGET TO BIND TO ADDITIONAL NETWORK INTERFACE IN UDF/RAVELLO

## INSTALLATION INSTRUCTIONS

Edit /etc/rc.local

```
sudo vi /etc/rc.local
```

Add following in /etc/rc.local

```
cd /home/ubuntu
rm -rf /home/ubuntu/manly_lamp update_git.sh
git clone https://github.com/chrisgmanly/manly_lamp.git --branch master
cp /home/ubuntu/manly_lamp/lab/update_git.sh /home/ubuntu
chmod +x /home/ubuntu/update_git.sh
chmod +x /home/ubuntu/manly_lamp/lab/*sh
/home/ubuntu/update_git.sh >> /home/ubuntu/update_git.log
chown -R ubuntu:ubuntu /home/ubuntu
```

## Reboot:
```
sudo init 6
```
