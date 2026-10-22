# Spec Delta

## ADDED Requirements

### Requirement: Home catalog excerpt

The home page SHALL render an excerpt of the first four projects in catalog order, below the featured set. The excerpt count SHALL match the number of rows it renders, not the size of the whole inventory, and the excerpt SHALL keep an action that leads to the full catalog.

#### Scenario: Excerpt size and order

- **WHEN** a visitor opens the home page in either locale
- **THEN** the excerpt renders exactly the first four projects in catalog order

#### Scenario: Count matches the excerpt

- **WHEN** the excerpt renders four rows
- **THEN** its count reads four and its action still leads to the full catalog

## MODIFIED Requirements

### Requirement: Contact surface

The site footer SHALL provide email, LinkedIn, GitHub, and CV access on every page. The public contact surface SHALL NOT expose the mobile phone number and SHALL NOT be repeated on the about pages.

#### Scenario: Contact links

- **WHEN** a visitor reaches the footer of any page
- **THEN** email, LinkedIn, GitHub, and a CV link to `https://resume.walkeralfaro.com/` are available and the phone number is not shown

#### Scenario: About pages do not repeat the contact block

- **WHEN** a visitor opens the about page in either locale
- **THEN** no contact block is rendered there and the footer remains the only contact surface
