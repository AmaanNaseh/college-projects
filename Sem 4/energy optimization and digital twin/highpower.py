import pandas as pd
import numpy as np

# data = pd.read_csv("serial_data.csv", encoding='unicode_escape')
data = pd.read_csv("serial_data.csv", encoding='unicode_escape')

print("data preview is : ", data.head(5))

midpoint = np.array(data['MidPoint'])
noise = np.array(data['Noise mV'])
temperature = np.array(data['Average Temperature (°C)'])
voltage = np.array(data['PZEM Voltage'])
current = np.array(data['PZEM Current'])
power = np.array(data['PZEM Power'])
energy = np.array(data['PZEM Energy'])
frequency = np.array(data['PZEM Frequency'])
powerfactor = np.array(data['PZEM PF'])

# print("Midpoint", midpoint)
# print("Noise", noise)
# print("Temperature", temperature)
print("Voltage", voltage)
print("Current", current)
print("Power", power)
# print("Energy", energy)
# print("Frequency", frequency)
# print("PF", powerfactor)

# print(type(midpoint))

# for mp in midpoint:
#     if mp > 100:
#         print("High")
#     else:
#         print("less")

for volt in voltage:
    if volt > 240:
        print("High Voltage")
        break
    else:
        continue

for curr in current:
    if curr > 150:
        print("High Current")
        break
    else:
        continue

for pwr in power:
    if pwr > 100:
        print("High Power")
        break
    else:
        continue