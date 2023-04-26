# Get DORA Metrics from GitHub project issues and releases

This GitHub Action will calculate a set of DevOps Research and Assessment (DORA) metrics based on status and dates from commits and issues

## Inputs

### 'repo'

Repository from where to read issues and statuses. Default is current repository where action is installed.

### 'owner'

Owner of the repository. Default is current repository owner or organisation.

## Outputs

### 'deploy-frequency'

Rate of deploys (tagged releases) per week

### 'lead-time'

Time from issue is set to status doing until linked pull-requestis merged to main

### 'change-falure-rate

Number of registered issues tagged as bugs divided by number of release tags last month 


```vegalite
{
  "description": "A simple bar chart with embedded data.",
  "data": {
    "values": [
      {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
      {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
      {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
    ]
  },
  "mark": {"type": "bar", "tooltip": true},
  "encoding": {
    "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```
