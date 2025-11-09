import tkinter as tk
import cv2
import os
import numpy as np
import csv
import time

win = tk.Tk()
win.title("F.R.S Software")
win.geometry("454x600")
win.configure(bg='light cyan')
img = tk.PhotoImage(file='icon.png')
win.iconphoto(False, img)
win.resizable(False, False)
clicked = tk.StringVar()

# **********************************************************************************************************************
# **********************************************************************************************************************
# For Saving Profile
def saveprofile():
    name = str(name_e.get())
    roll_no = int(roll_e.get())
    gender = str(clicked.get())

    info = [str(name), str(roll_no), str(gender)]
    with open('students.csv', 'a') as csvFile1:
        write = csv.writer(csvFile1)
        write.writerow(info)
    csvFile1.close()



# **********************************************************************************************************************
# For Taking Photos
def takephotos():

    dataset = 'dataset'
    name = str(name_e.get())
    roll_no = int(roll_e.get())
    gender = str(clicked.get())
    path = os.path.join(dataset, name)
    if not os.path.isdir(path):
        os.makedirs(path)
        print(name)

    alg = "haarcascade_frontalface_default.xml"
    haar_cascade = cv2.CascadeClassifier(alg)

    print("Starting video stream....")
    cam = cv2.VideoCapture(0)
    time.sleep(1)

    (width, height) = (130, 100)
    count = 1

    while count < 31:
        print(count)
        _, img = cam.read()

        grayImg = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face = haar_cascade.detectMultiScale(grayImg, 1.3, 4)
        for (x, y, w, h) in face:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            faceOnly = grayImg[y:y + h, x:x + w]
            resizeImg = cv2.resize(faceOnly, (width, height))
            cv2.imwrite("%s/%s.jpg" % (path, count), resizeImg)
            count += 1
        cv2.imshow("Face_Detection", img)
        key = cv2.waitKey(10)
        if key == 27:
            break

    hello = "Image Captured Successfully "
    label = tk.Label(text=hello, bg='light cyan', width=30, font=("Century", 13), anchor='center', justify='center')
    label.grid(row=8, column=0, columnspan=2, pady=5)
    cam.release()
    cv2.destroyAllWindows()



# **********************************************************************************************************************
# For Recognizing:
def recognize():
    # Code for Laptop Camera and USB or WebCam
    alg = "haarcascade_frontalface_default.xml"
    haar_cascade = cv2.CascadeClassifier(alg)

    datasets = 'dataset'
    print('Training...')
    (images, labels, names, id) = ([], [], {}, 0)

    for (subdirs, dirs, files) in os.walk(datasets):
        for subdir in dirs:
            names[id] = subdir
            subpath = os.path.join(datasets, subdir)
            for filename in os.listdir(subpath):
                path = subpath + '/' + filename
                label = id
                images.append(cv2.imread(path, 0))
                labels.append(int(label))
            id += 1

    (images, labels) = [np.array(lis) for lis in [images, labels]]
    print(images, labels)

    (width, height) = (130, 100)

    model = cv2.face.LBPHFaceRecognizer.create()

    haar_cascade = cv2.CascadeClassifier(alg)
    model.train(images, labels)
    # Change 0 to 1 or 2 (hit & trial) if you are using external Camera like USB or WebCam
    cam = cv2.VideoCapture(0)
    cnt = 0

    while True:
        _, img = cam.read()
        grayImg = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = haar_cascade.detectMultiScale(grayImg, 1.3, 4)
        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            face = grayImg[y:y + h, x:x + w]
            face_resize = cv2.resize(face, (width, height))

            prediction = model.predict(face_resize)
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 3)

            if prediction[1] < 800:
                cv2.putText(img, '%s - %.0f' % (names[prediction[0]], prediction[1]), (x - 10, y - 10),
                            cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255))
                print(names[prediction[0]])
                cnt = 0

            else:
                cnt += 1
                cv2.putText(img, 'Unknown', (x - 10, y - 10), cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255))
                if (cnt > 100):
                    print("Unknown Person")
                    cv2.imwrite('unknwon.jpg', img)
                    cnt = 0

        cv2.imshow("Face_Recognition", img)
        key = cv2.waitKey(10)
        if key == 27:
            break

    cam.release()
    cv2.destroyAllWindows



# ***********************************************************************************************************************
# For Clearing
def clr():
    name_e.delete(0, tk.END)
    roll_e.delete(0, tk.END)
    clicked.set(option[0])



# **********************************************************************************************************************
# **********************************************************************************************************************
# MENUBAR COMMANDS

menubar = tk.Menu(win)
filemenu = tk.Menu(menubar, tearoff=0)
filemenu.add_command(label='Change Password')
filemenu.add_command(label='Contact Us')
filemenu.add_command(label='Exit', command=win.quit)
menubar.add_cascade(label='Help', font=('comic', 29, ' bold '), menu=filemenu)
win.configure(menu=menubar)

# **********************************************************************************************************************
# Create the Widgets for GUI
# **********************************************************************************************************************
# Create Labels
# Creating Labels
heading = tk.Label(text="FACIAL RECOGNITION", width=20,
                   font=("century", 19, 'bold'), bg='light cyan', anchor='center', justify='center')
heading2 = tk.Label(text="SOFTWARE", width=10, font=("century", 19, 'bold'), bg='light cyan',
                    anchor='center', justify='center')

name = tk.Label(text="Name: ", width=7, bg='light cyan', font=("Century", 15), anchor='w', justify='center')
user_id = tk.Label(text="User ID: ", width=7, bg='light cyan', font=("Century", 15), anchor='w', justify='center')
gender = tk.Label(text="Gender: ", width=7, bg='light cyan', font=("Century", 15), anchor='w', justify='center')

# Creating Entries
name_e = tk.Entry(width=25, bd=2, font=('century', 11), justify='left')
roll_e = tk.Entry(width=25, bd=2, font=('century', 11), justify='left')

# Creating Buttons
images = tk.Button(text="TAKE IMAGES", bg='light green', width=18, height=1, font=("Century", 18), command=takephotos)
profile = tk.Button(text="SAVE PROFILE", bg='light green', width=18, height=1, font=("Century", 16),
                    command=saveprofile)
clear = tk.Button(text="CLEAR", width=10, height=1, font=("century", 12), command=clr)

# Creating Info Box
Word1 = 'Save Profile  >>>  Take Images'
info1 = tk.Label(text=Word1, width=24, height=0, font=("Century", 15), anchor='center',
                 bg='light cyan', justify='center')

Word2 = '''After Saving Profile, or
For Recognizing a Person   
Click on Recognize'''
info2 = tk.Label(text=Word2, width=23, height=0, font=("Century", 15), anchor='center',
                 bg='light cyan', justify='center')

recognize = tk.Button(text="RECOGNIZE", bg='#FFA500', width=20, height=1, font=("century", 20, 'bold'),
                      relief=tk.RIDGE, command=recognize)

# Creating Gender Drop Down Menu
option = ["Select Any One", "Male", "Female", "Others"]
gender_e = tk.OptionMenu(win, clicked, *option)
clicked.set(option[0])


# **********************************************************************************************************************
# **********************************************************************************************************************
# Creating Grid of Widgets
# Creating Labels
heading.grid(row=0, column=0, columnspan=2, padx=55, pady=(10, 0))
heading2.grid(row=1, column=0, columnspan=2, padx=55, pady=(0, 10))

name.grid(row=2, column=0, pady=2)
user_id.grid(row=3, column=0, pady=2)
gender.grid(row=4, column=0, pady=2)

# Creating Entries
name_e.grid(row=2, column=1, sticky='w', pady=2)
roll_e.grid(row=3, column=1, sticky='w', pady=2)

# Creating Buttons
profile.grid(row=6, column=0, columnspan=2, pady=(5, 0))
images.grid(row=7, column=0, columnspan=2, pady=5)
clear.grid(row=9, column=0, columnspan=2, pady=5)
# Creating Info Box
info1.grid(row=5, column=0, columnspan=2, pady=(8, 0))
info2.grid(row=10, column=0, columnspan=2, pady=4)

recognize.grid(row=11, column=-0, columnspan=2, pady=4)

# Creating Gender Drop Down Menu
gender_e.grid(row=4, column=1, sticky='w', pady=2)


# ***********************************************************************************************************************
win.mainloop()
