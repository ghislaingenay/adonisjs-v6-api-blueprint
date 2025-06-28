#!/bin/bash

# Usage: ./create.sh <name>
# Example: ./create.sh employee

if [ -z "$1" ]; then
  echo "Error: No name provided. Usage: ./module.sh <name>"
  exit 1
fi

NAME=$1
LOWER_NAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')
CAPITALIZED_NAME=$(echo "$NAME" | sed -E 's/(^|_)([a-z])/\U\2/g')


echo "Creating components for: $CAPITALIZED_NAME"

# Create a validator
echo "Creating validator..."
node ace make:validator $LOWER_NAME

# Create a repository
echo "Creating repository..."
REPO_PATH="app/repositories/${LOWER_NAME}.ts"
touch $REPO_PATH
echo "export default class ${CAPITALIZED_NAME}Repository {" >> $REPO_PATH
echo "  // Add repository methods here" >> $REPO_PATH
echo "}" >> $REPO_PATH

# Create a model, migration, and controller
echo "Creating model, migration, and controller..."
node ace make:model -mc $LOWER_NAME

# Create a service
echo "Creating service..."
node ace make:service $LOWER_NAME

# Create dto
echo "Creating dto..."
DTO_PATH="app/dtos/${LOWER_NAME}.ts"
echo "import $CAPITALIZED_NAME from '#models/$LOWER_NAME'" >> $DTO_PATH
echo "import invariant from 'tiny-invariant'" >> $DTO_PATH
echo "export type "$CAPITALIZED_NAME"Dto = {}" >> $DTO_PATH
echo "" >> $DTO_PATH
echo "export default class ${CAPITALIZED_NAME}Client {" >> $DTO_PATH
echo "  private name = '$CAPITALIZED_NAME'" >> $DTO_PATH
echo "  private resource " >> $DTO_PATH
echo "" >> $DTO_PATH
echo "constructor(resource: $CAPITALIZED_NAME) {" >> $DTO_PATH
echo "  this.resource = resource" >> $DTO_PATH
echo "}" >> $DTO_PATH
echo "" >> $DTO_PATH
echo "toJSON(): "$CAPITALIZED_NAME"Dto {" >> $DTO_PATH
echo "    invariant(this.resource, this.name + 'is not defined')" >> $DTO_PATH
echo "    return  {}}" >> $DTO_PATH
echo "" >> $DTO_PATH
echo "}" >> $DTO_PATH

echo "All components for $CAPITALIZED_NAME have been created successfully!"