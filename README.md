# Get DevOps Metrics from GitHub project issues and releases

This GitHub Action will calculate a set of DevOps Research and Assessment (DORA) metrics based on status and dates from commits and issues

## Inputs

### `repo`

Repository from where to read issues and statuses. Default is current repository where action is installed.

### `owner`

Owner of the repository. Default is current repository owner or organisation.

## Outputs

### `deploy-frequency`

Rate of deploys (tagged releases) per week.
Decimal number. Elite performing teams has 7 as target (daily- or on-demand release)

### `lead-time`

Time from issue is set to status doing until linked pull-requestis merged to main branch.
Number in days (Integer)

### `change-falure-rate`

Number of registered issues tagged as bugs divided by number of release tags last month. 
By counting the bugs (github issues tagged as `bug`) between releases the last month and average this, we get the failures over releases rate.
Number in range 0 - 100 (%)

### `mttr`

Mean time to restore. This metric is calculated based on the time between the last release before an issue tagged as a bug and the first release after the bug is closed.
For this to work correctly we must assume github issues are created for all unwanted issues in production and that all changes to production is done through releases.
Number in hours (integer)
