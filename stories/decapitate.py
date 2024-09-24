import os

# Define the root directory as the script's location
root_dir = os.path.dirname(os.path.abspath(__file__))

# Loop through all directories and subdirectories
for subdir, dirs, files in os.walk(root_dir):
    if '__main.php' in files:
        main_file_path = os.path.join(subdir, '__main.php')
        head_file_path = os.path.join(subdir, '__head.php')

        # Read the first line of __main.php
        with open(main_file_path, 'r') as main_file:
            lines = main_file.readlines()

        if lines:
            first_line = lines[0]

            # Write the first line to __head.php
            with open(head_file_path, 'w') as head_file:
                head_file.write(first_line)

            # Write back the rest of the lines to __main.php
            with open(main_file_path, 'w') as main_file:
                main_file.writelines(lines[1:])

print("Process completed!")
