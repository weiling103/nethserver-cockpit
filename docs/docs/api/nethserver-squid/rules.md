# rules

Read and set Squid rules from `squid` database.

## read

The read API takes an `action` field.

Valid actions are:

- `rule-list`
- `source-list`
- `action-list`

Input example:
```json
{
  "action": "rule-list"
}
```

### Output

#### rule-list

Return the list of configured rules.

Output example:
```json
{
  "rules": [
    {
      "status": "enabled",
      "Action": {
        "name": "tim",
        "type": "force"
      },
      "name": "3",
      "Dst": [
        "repubblica.it"
      ],
      "Src": {
        "name": "cidr1",
        "type": "cidr"
      },
      "type": "rule",
      "Description": ""
    },
    {
      "status": "enabled",
      "Action": {
        "name": "low",
        "type": "priority"
      },
      "name": "4",
      "Dst": [
        "windowsupdate.microsoft.com",
        "update.microsoft.com",
        "windowsupdate.com",
        "download.windowsupdate.com",
        "download.microsoft.com",
        "download.windowsupdate.com",
        "test.stats.update.microsoft.com",
        "ntservicepack.microsoft.com"
      ],
      "Src": {
        "name": "green",
        "type": "role"
      },
      "type": "rule",
      "Description": ""
    },
    ...
  ]
}
```

#### source-list

List all objects usable inside the `Src` field.

Output example:
```json
{
  "sources": [
    {
      "name": "a123",
      "IpAddress": "1.2.3.4",
      "type": "host",
      "Description": ""
    },
    {
      "name": "green",
      "type": "role"
    },
    ...
  ]
}
```

#### action-list

List all available actions to be used inside the `Action` field.

Example:
```json
{
  "actions": [
    {
      "name": "high",
      "type": "class"
    },
    {
      "name": "red1",
      "type": "provider"
    },
    {
      "name": "red2",
      "type": "force"
    }
  ]
}
```

## validate

Valid actions are:

- `create`
- `update`
- `delete`

### Constraints

Constraints for `create` action:

...

### Input

#### create

Create a new rule, the key is generated by the API.

Input example:
```json
{
  "action": "update",
  "status": "enabled",
  "Action": {
    "type": "force",
    "name": "red1"
  },
  "Src": {
    "name": "host",
    "type": "a123"
  },
  "Dst": [
    "domain1.org",
    "domain2.org"
  ],
  "Description": "desc1"
}
```

#### update

Update and existing rule.

Input example:
```json
{
  "action": "update",
  "status": "enabled",
  "Action": {
    "type": "force",
    "name": "red1"
  },
  "Src": {
    "name": "host",
    "type": "a123"
  },
  "Dst": [
    "domain1.org",
    "domain2.org"
  ],
  "Description": "desc1",
  "name": "7"
}
```

## update

Same input from validate helper.

Extra valid actions:

- `enable-bypass`: enable given rule
- `disable-bypass`: disable given rule

Input example for enable action:
```json
{
  "action": "enable",
  "name": "t1"
}
```

Input example for disable action:
```json
{
  "action": "disable",
  "name": "t1"
}
```

## delete

Delete the given record.

Input example:
```json
{
  "name": "t1"
}
```

