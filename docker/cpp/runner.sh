#!/bin/bash

FILE="program.cpp"
OUT="program.out"

# Read code from stdin
cat > $FILE

# Compile
g++ $FILE -o $OUT 2> error.txt

# If compilation fails
if [ -s error.txt ]; then
  cat error.txt
  exit 1
fi

# Run with timeout protection
timeout 3s ./$OUT 2>&1

# If timeout triggered
if [ $? -eq 124 ]; then
  echo "Execution timed out (3 seconds limit)"
fi

# Cleanup
rm -f $FILE $OUT error.txt