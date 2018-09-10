# system-dns

Read and set upstream DNS servers for DNSMasq.

# read

## Input

Return the value of `NameServers` record from `configuration` db.
The record is inside the the `configuration` field:
```json
{
  "status": "",
  "configuration": {
    "props": {
      "NameServers": "8.8.8.8"
    },
    "name": "dns",
    "type": "configuration"
  }
}
```

# validate

## Constraints

- Nameservers must be a comma-separeted list of valid IPv4 addresses

## Input

The `NameServers` record from `configuration  esmith db record in JSON format.

The NameServers property is a comma-separated list of IP address.
It must contain at least one element.

Validation example:
```
echo '{"props":{"NameServers":"8.8.8.8"},"name":"dns","type":"configuration"}' | ./validate
```

# write

Use the same input of validate.