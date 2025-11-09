from pandas import read_csv
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
import pickle
import csv

import tkinter as tk
from tkinter import messagebox

class MyGUI:

    def __init__(self):
        self.root = tk.Tk()

        self.root.geometry("1920x1080")
        self.root.title("Registration Window")
        self.root.configure(bg="gray")


        #Train button
        self.trainbtn = tk.Button(self.root, text="Train ML model", height=2, width=25, font=("Arial", 25), bg="white", command=self.train)
        self.trainbtn.pack(padx=5, pady=5)

        self.accuracypagebtn = tk.Button(self.root, text="Check Accuracy", height=2, width=25, font=("Arial", 25), bg="white", command=self.accuracy_window)
        self.accuracypagebtn.pack(padx=10, pady=10)

        self.predictpagebtn = tk.Button(self.root, text="Prediction Interface", height=2, width=25, font=("Arial", 25), bg="white", command=self.prediction_window)
        self.predictpagebtn.pack(padx=10, pady=10)            

        #Close
        self.root.protocol("WM_DELETE_WINDOW", self.close)

        #Run
        self.root.mainloop()

    
    def train(self):
        self.file = "serial_data.csv"
        self.dataset = read_csv("serial_data.csv", encoding='unicode_escape')
        self.dataset['OUTPUT'] = self.dataset['OUTPUT'].map({'normal': 0, 'medium': 1, "high": 2, "csmr": 3, "pgvf":4})

        self.array = self.dataset.values
        self.X = self.array[:,0:8]
        self.y = self.array[:,9]
        self.X_train, self.X_test, self.Y_train, self.Y_test = train_test_split(self.X, self.y, test_size=0.50, random_state=1)

        self.sc = StandardScaler()
        self.X_train = self.sc.fit_transform(self.X_train)
        self.X_test = self.sc.transform(self.X_test)

        self.model = SVC(gamma='auto')
    
        self.model.fit(self.X_train, self.Y_train)

        self.filename = 'model.pkl'
        pickle.dump(self.model, open(self.filename, 'wb'))

        #Accuracy
        self.loaded_model = pickle.load(open(self.filename, 'rb'))
        self.accuracy = self.loaded_model.score(self.X_test, self.Y_test)
        print(self.accuracy)

        #Prediction
        self.midpoint = 0
        self.noise = 0
        self.temperature = 0
        self.voltage = 0
        self.current = 0
        self.power = 0
        self.energy = 0
        self.frequency = 0
        self.powerfactor = 0

        with open('testdata.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            
            writer.writerow(['MidPoint', 'Noise mV', 'Average Temperature (°C)', 'PZEM Voltage', 'PZEM Current', 'PZEM Power', 'PZEM Energy', 'PZEM Frequency', 'PZEM PF'])
            writer.writerow([self.midpoint, self.noise, self.temperature, self.voltage, self.current, self.power, self.energy, self.frequency, self.powerfactor])


        self.testdataset = read_csv("testdata.csv", encoding='unicode_escape')
        self.newarray = self.testdataset.values
        self.X_new = self.newarray[:,0:8]
        self.testdata = self.sc.transform(self.X_new)
        self.pred = self.model.predict(self.testdata)

        messagebox.showinfo(title="Model Saved", message="Training Successful and Model is saved")

    def accuracy_window(self):
        self.accpage = tk.Toplevel()
        self.accpage.geometry("1920x1080")
        self.accpage.configure(bg="grey")
        self.accpage.title("Accuracy Interface")

        #Accuracy button
        self.accuracytitle = tk.Label(self.accpage, text="Accuracy", font=("Arial", 10))
        self.accuracytitle.pack(padx=5, pady=5)

        #Accuracy Score
        self.acc = tk.Label(self.accpage, text= (str(self.accuracy*100) + " %"), font=("Arial", 20))
        self.acc.place(x=625, y=100)

        #Close
        self.accpage.protocol("WM_DELETE_WINDOW", self.closeacc)

    def prediction_window(self):
        self.predpage = tk.Toplevel()
        self.predpage.geometry("1920x1080")
        self.predpage.configure(bg="grey")
        self.predpage.title("Predicton Interface")

        #Prediction parameters
        self.test_title = tk.Label(self.predpage, text="Enter values for prediction", font=("Arial", 10))
        self.test_title.pack(padx=5, pady=5)
        
        #Midpoint
        self.MIDPOINT_label = tk.Label(self.predpage, text="ENTER MIDPOINT", font=("Arial", 10))
        self.MIDPOINT_label.pack(padx=5, pady=5)

        self.MIDPOINT= tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.MIDPOINT.pack(padx=5, pady=5)

        #Noise
        self.NOISE_label = tk.Label(self.predpage, text="ENTER NOISE", font=("Arial", 10))
        self.NOISE_label.pack(padx=5, pady=5)

        self.NOISE = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.NOISE.pack(padx=5, pady=5)

        #Temperature
        self.TEMPERATURE_label = tk.Label(self.predpage, text="ENTER TEMPERATURE", font=("Arial", 10))
        self.TEMPERATURE_label.pack(padx=5, pady=5)

        self.TEMPERATURE = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.TEMPERATURE.pack(padx=5, pady=5)

        #Voltage
        self.VOLTAGE_label = tk.Label(self.predpage, text="ENTER VOLTAGE", font=("Arial", 10))
        self.VOLTAGE_label.pack(padx=5, pady=5)

        self.VOLTAGE = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.VOLTAGE.pack(padx=5, pady=5)

        #Current
        self.CURRENT_label = tk.Label(self.predpage, text="ENTER CURRENT", font=("Arial", 10))
        self.CURRENT_label.pack(padx=5, pady=5)

        self.CURRENT = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.CURRENT.pack(padx=5, pady=5)

        #Power
        self.POWER_label = tk.Label(self.predpage, text="ENTER POWER", font=("Arial", 10))
        self.POWER_label.pack(padx=5, pady=5)

        self.POWER = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.POWER.pack(padx=5, pady=5)

        #Energy
        self.ENERGY_label = tk.Label(self.predpage, text="ENTER ENERGY", font=("Arial", 10))
        self.ENERGY_label.pack(padx=5, pady=5)

        self.ENERGY = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.ENERGY.pack(padx=5, pady=5)

        #Frequency
        self.FREQUENCY_label = tk.Label(self.predpage, text="ENTER FREQUENCY", font=("Arial", 10))
        self.FREQUENCY_label.pack(padx=5, pady=5)

        self.FREQUENCY = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.FREQUENCY.pack(padx=5, pady=5)

        #Power Factor
        self.POWERFACTOR_label = tk.Label(self.predpage, text="ENTER POWERFACTOR", font=("Arial", 10))
        self.POWERFACTOR_label.pack(padx=5, pady=5)

        self.POWERFACTOR = tk.Entry(self.predpage, width=50, font=("Arial", 10))
        self.POWERFACTOR.pack(padx=10, pady=10)

        #Predict button
        self.predictbtn = tk.Button(self.predpage, text="Predict", height=1, width=25, font=("Arial", 10), bg="white", command=self.predict)
        self.predictbtn.pack(padx=5, pady=5)
        
        #Output
        self.output = tk.Label(self.predpage, text=self.pred, font=("Arial", 20))
        self.output.place(x=735, y=675)

        #Close
        self.predpage.protocol("WM_DELETE_WINDOW", self.closepred)

    def predict(self):
        self.midpoint = self.MIDPOINT.get() #549
        self.noise = self.NOISE.get() #21
        self.temperature = self.TEMPERATURE.get() #41.57
        self.voltage = self.VOLTAGE.get() #219.34
        self.current = self.CURRENT.get() #15.65
        self.power = self.POWER.get() #2921.79
        self.energy = self.ENERGY.get() #21.27
        self.frequency = self.FREQUENCY.get() #49.56
        self.powerfactor = self.POWERFACTOR.get() #1

        with open('testdata.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            
            writer.writerow(['MidPoint', 'Noise mV', 'Average Temperature (°C)', 'PZEM Voltage', 'PZEM Current', 'PZEM Power', 'PZEM Energy', 'PZEM Frequency', 'PZEM PF'])
            writer.writerow([self.midpoint, self.noise, self.temperature, self.voltage, self.current, self.power, self.energy, self.frequency, self.powerfactor])


        self.testdataset = read_csv("testdata.csv", encoding='unicode_escape')
        self.newarray = self.testdataset.values
        self.X_new = self.newarray[:,0:8]
        self.testdata = self.sc.transform(self.X_new)
        self.pred = self.model.predict(self.testdata)

        self.normal = "Normal"
        self.medium = "Medium"
        self.high = "High"
        self.csmr = "CSMR"
        self.pgvf = "PGVF"

        if self.pred == 0:
            self.pred = self.normal

        if self.pred == 1:
            self.pred = self.medium

        if self.pred == 2:
            self.pred = self.high

        if self.pred == 3:
            self.pred = self.csmr

        if self.pred == 4:
            self.pred = self.pgvf


        print(self.pred)

        messagebox.showinfo(title="Prediction Successful", message="Prediction Successful, Please close this prediction interface and open again")
    
    def closeacc(self):
        if messagebox.askyesno(title="Quit?", message="Do you want to quit ?"):
            self.accpage.destroy()    

    def closepred(self):
        if messagebox.askyesno(title="Quit?", message="Do you want to quit ?"):
            self.predpage.destroy()

    def close(self):
        if messagebox.askyesno(title="Quit?", message="Do you want to quit ?"):
            self.root.destroy()

MyGUI()