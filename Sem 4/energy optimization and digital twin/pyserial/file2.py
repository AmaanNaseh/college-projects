import serial
import csv
import os
import re

# Define the serial port and baud rate
serial_port = 'COM3'  # Update with your serial port
baud_rate = 115200  # Update with your baud rate
csv_filename = 'serial_data.csv'

# Check if CSV file exists, create headers if not
file_exists = os.path.isfile(csv_filename)

# Open CSV file in append mode ('a' to add new data)
with open(csv_filename, 'a', newline='') as csv_file:
    headers = ['MidPoint', 'Noise mV', 'Average Temperature (°C)', 'PZEM Voltage', 'PZEM Current', 'PZEM Power', 'PZEM Energy', 'PZEM Frequency', 'PZEM PF']
    csv_writer = csv.DictWriter(csv_file, fieldnames=headers)

    if not file_exists:
        csv_writer.writeheader()  # Write headers only if the file is created newly

    # Create a serial object
    ser = serial.Serial(serial_port, baud_rate, timeout=1)

    try:
        # Initialize variables to store MidPoint, Noise mV, Voltage, Current, and PZEM values
        midpoint = ''
        noise_mv = ''
        avg_temperature = ''
        pzem_voltage = ''
        pzem_current = ''
        pzem_power = ''
        pzem_energy = ''
        pzem_frequency = ''
        pzem_pf = ''

        while True:
            # Read the data from the serial port
            serial_data = ser.readline().decode('utf-8').strip()

            # Use regular expressions to extract key-value pairs from the serial data
            data_pairs = re.findall(r'([a-zA-Z ]+): (.+)', serial_data)

            if data_pairs:
                # Create a dictionary to store parsed data
                data_dict = {key.strip(): value.strip() for key, value in data_pairs}

                # Print parsed data to serial monitor for debugging
                print("Parsed Data:", data_dict)

                # Update MidPoint, Noise mV, Voltage, Current, and PZEM values if available
                for key, value in data_dict.items():
                    if key == 'MidPoint':
                        midpoint = value
                    elif key == 'Noise mV':
                        noise_mv = value
                    elif key == 'Average Temperature':
                        avg_temperature = value
                    elif key == 'PZEM Voltage':
                        pzem_voltage = value
                    elif key == 'PZEM Current':
                        pzem_current = value
                    elif key == 'PZEM Power':
                        pzem_power = value
                    elif key == 'PZEM Energy':
                        pzem_energy = value
                    elif key == 'PZEM Frequency':
                        pzem_frequency = value
                    elif key == 'PZEM PF':
                        pzem_pf = value

                # Prepare dictionary for CSV writing, ensuring all columns are present
                row_data = {
                    'MidPoint': midpoint,
                    'Noise mV': noise_mv,
                    'Average Temperature (°C)': avg_temperature,
                    'PZEM Voltage': pzem_voltage,
                    'PZEM Current': pzem_current,
                    'PZEM Power': pzem_power,
                    'PZEM Energy': pzem_energy,
                    'PZEM Frequency': pzem_frequency,
                    'PZEM PF': pzem_pf
                }

                # Write to CSV
                csv_writer.writerow(row_data)
                csv_file.flush()  # Flush buffer to ensure immediate writing to file

    except KeyboardInterrupt:
        print("Keyboard Interrupt. Exiting...")

    finally:
        # Close the serial port connection
        ser.close()
