# VPS SSH Initialization & Consistency Guide

Use these commands once you log in to your new instance for the first time. They will ensure you never get locked out, even when using restricted WiFi.

## 1. Ensure Port 22 is Open on the Server
Oracle Ubuntu images often have internal `iptables` rules that block traffic even if the Oracle Console is open.

```bash
# Force open Port 22 in iptables
sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT
sudo netfilter-persistent save
```

## 2. Set Up Port 443 Fallback (Critical for School WiFi)
If your network blocks Port 22, we can make SSH listen on Port 443 (which is usually open for HTTPS).

```bash
# 1. Edit SSH config
sudo sed -i 's/#Port 22/Port 22\nPort 443/' /etc/ssh/sshd_config

# 2. Allow Port 443 in the local firewall
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

# 3. Restart SSH
sudo systemctl restart ssh
```

## 3. Persistent Public Keys (Cloud Shell + Xshell)
Ensure both your Cloud Shell and your local Windows machine are allowed.

```bash
# Create the directory if it doesn't exist
mkdir -p ~/.ssh && chmod 700 ~/.ssh

# Append your keys (Replace the strings below with your actual public keys)
# You can run this multiple times for different keys
echo "ssh-rsa AAAAB3Nza... (your cloud shell key)" >> ~/.ssh/authorized_keys
echo "ssh-rsa AAAAB3Nza... (your xshell key)" >> ~/.ssh/authorized_keys

# Fix permissions
chmod 600 ~/.ssh/authorized_keys
```

## 4. Connection Commands

### From Cloud Shell (Standard)
```bash
ssh -i "ssh-key-2026-02-26.key" ubuntu@150.136.104.186
```

### From Xshell (Restricted Network Fallback)
If standard connection fails, change the **Port** in your Xshell session from `22` to **`443`**.

---

### Internal Checklist for Oracle Console:
- [ ] **Ingress Rule 1:** Port 22 (TCP) from `0.0.0.0/0`
- [ ] **Ingress Rule 2:** Port 443 (TCP) from `0.0.0.0/0`
