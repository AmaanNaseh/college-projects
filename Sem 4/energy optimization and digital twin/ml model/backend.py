from pandas import read_csv
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
import pickle
import csv

file = "serial_data.csv"
#names = ['MidPoint', 'Noise mV', 'Average Temperature (°C)', 'PZEM Voltage', 'PZEM Current', 'PZEM Power', 'PZEM Energy', 'PZEM Frequency', 'PZEM PF', 'OUTPUT']

dataset = read_csv("serial_data.csv", encoding='unicode_escape')

print("data preview is : ", dataset.head(5))

dataset['OUTPUT'] = dataset['OUTPUT'].map({'normal': 0, 'medium': 1, "high": 2, "csmr": 3, "pgvf":4})

array = dataset.values
X = array[:,0:8]
y = array[:,9]
X_train, X_test, Y_train, Y_test = train_test_split(X, y, test_size=0.50, random_state=1)

sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

model = SVC(gamma='auto')
#model = LogisticRegression(solver='liblinear', multi_class='ovr')

model.fit(X_train, Y_train)

filename = 'model.pkl'
pickle.dump(model, open(filename, 'wb'))

loaded_model = pickle.load(open(filename, 'rb'))
result = loaded_model.score(X_test, Y_test)
print(result)

# value = [[213.11479999999997,0.252315,53.772060761999995]]
# predictions = model.predict(value)
# print(predictions[0])

midpoint = 549
noise = 21
temperature = 41.57
voltage = 219.34
current = 15.65
power = 2921.79
energy = 21.27
frequency = 49.56
powerfactor = 1

with open('testdata.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    
    writer.writerow(['MidPoint', 'Noise mV', 'Average Temperature (°C)', 'PZEM Voltage', 'PZEM Current', 'PZEM Power', 'PZEM Energy', 'PZEM Frequency', 'PZEM PF'])
    writer.writerow([midpoint, noise, temperature, voltage, current, power, energy, frequency, powerfactor])


testdataset = read_csv("testdata.csv", encoding='unicode_escape')
array = testdataset.values
X_new = array[:,0:8]
testdata = sc.transform(X_new)
pred = model.predict(testdata)
print(pred)