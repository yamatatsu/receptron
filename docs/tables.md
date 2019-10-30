# DynamoDB Tables

## Account

- **cognitoId**
- organisationId

## Event

- **organisationId**
- **timestamp**
- type
- payload
  - ...

## Organisation

- **organisationId**
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

- **organisationId**
- **timestamp**
- name
- affiliation
- destinationId
- atatus
