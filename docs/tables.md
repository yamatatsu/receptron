# DynamoDB Tables

## Account

- **cognitoId**
- organizationId

## Event

- **organizationId**
- **timestamp**
- type
- payload
  - ...

## Organization

- **organizationId**
- name
- qrCode
- menuItems[]
  - label
  - inputs[]
    - type
    - label
    - other...
- destinations[]
  - name
  - imageUrl
  - notifyTo
- lastEventTimestamp
- createdAt
- updatedAt

## Call

- **organizationId**
- **timestamp**
- name
- affiliation
- destinationId
- atatus
