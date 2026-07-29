Create 4 additional network topology examples for the PacketNest network simulator using the available device types:

Devices available:

router
wireless-router
switch
pc
server
laptop
smartphone
firewall

Each example should include:

A clear scenario name
List of devices used
IP addressing scheme (subnets and gateways)
Logical purpose of the network
How devices are connected (topology description)
Expected connectivity behavior (who can talk to whom)

New Example Scenarios to Generate:

VLAN Office Network
Multiple departments separated using VLANs on a switch
Router provides inter-VLAN routing
PCs in different VLANs should communicate only through the router
Redundant Dual-Router Network
Two routers connected to the same LAN
One acts as primary gateway and the other as backup
Demonstrates failover or redundancy concept
Guest WiFi Isolation Network
Wireless router provides Guest network
Internal LAN connected via switch
Guest devices can access internet/server but cannot access internal PCs
Server Farm with Load Access
Multiple servers connected to a switch
Firewall controls access to servers
Clients connect to services hosted on servers

For each scenario:

Use realistic private IP ranges (e.g., 192.168.x.x or 10.x.x.x)
Ensure routing logic is valid
Include default gateways for all hosts
Keep topology simple and educational for students learning networking basics
Writing# PacketNest Network Testing Instructions

Purpose:
These tests verify connectivity, routing, and security behavior for each network scenario.

General Ping Command Format:
ping <destination IP>

---

## SCENARIO 1: VLAN Office Network

Devices:
PC1 (192.168.10.10)
PC2 (192.168.20.10)
Router Gateway VLAN10: 192.168.10.1
Router Gateway VLAN20: 192.168.20.1

Tests:

1. Test local gateway connectivity
   ping 192.168.10.1

Expected Result:
Ping successful

2. Test inter-VLAN communication
   ping 192.168.20.10

Expected Result:
Ping successful only if router routing is configured

3. Test same VLAN communication
   ping another PC in same VLAN

Expected Result:
Ping successful

---

## SCENARIO 2: Redundant Dual-Router Network

Devices:
Router1: 192.168.1.1
Router2: 192.168.1.2
PC: 192.168.1.10

Tests:

1. Ping primary router
   ping 192.168.1.1

Expected Result:
Ping successful

2. Ping backup router
   ping 192.168.1.2

Expected Result:
Ping successful

3. Disconnect primary router and test backup
   ping 192.168.1.2

Expected Result:
Ping still successful (failover simulation)

---

## SCENARIO 3: Guest WiFi Isolation Network

Devices:
Internal PC: 192.168.0.10
Guest Smartphone: 192.168.50.10
Server: 192.168.0.100
Gateway: 192.168.0.1

Tests:

1. Guest to Server access
   ping 192.168.0.100

Expected Result:
Blocked (security isolation)

2. Guest to Gateway
   ping 192.168.50.1

Expected Result:
Ping successful

3. Internal PC to Server
   ping 192.168.0.100

Expected Result:
Ping successful

---

## SCENARIO 4: Server Farm with Firewall

Devices:
Client PC: 192.168.1.10
Firewall: 192.168.1.1
Server1: 10.0.0.10
Server2: 10.0.0.11

Tests:

1. Client to Firewall
   ping 192.168.1.1

Expected Result:
Ping successful

2. Client to Server1
   ping 10.0.0.10

Expected Result:
Allowed only if firewall rule permits

3. Block unauthorized traffic test
   Attempt ping to restricted port/service

Expected Result:
Connection blocked

---

## Basic Validation Checklist

✔ All devices have IP addresses
✔ Default gateway is configured
✔ Interfaces are UP
✔ Routing table exists on router
✔ Firewall rules match policy
✔ Subnet masks are correct

End of Test File
