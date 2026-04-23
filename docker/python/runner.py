import sys
import subprocess
import os

CODE_FILE = "temp.py"

def main():
    code = sys.stdin.read()

    with open(CODE_FILE, "w") as f:
        f.write(code)

    try:
        result = subprocess.run(
            ["python", CODE_FILE],
            capture_output=True,
            text=True,
            timeout=3
        )

        output = result.stdout if result.stdout else result.stderr
        print(output)

    except subprocess.TimeoutExpired:
        print("Execution timed out (3 seconds limit)")
    except Exception as e:
        print(f"Error: {str(e)}")

    finally:
        if os.path.exists(CODE_FILE):
            os.remove(CODE_FILE)

if __name__ == "__main__":
    main()