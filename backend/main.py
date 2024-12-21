import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LinearRegression
import json
import os

# Flask app setup
app = Flask(__name__)
CORS(app)

# Load and preprocess data
def load_data(file_path):
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        return df
    else:
        print(f"File {file_path} not found.")
        return None

def preprocess_data(dataset):
    label_encoder_community = LabelEncoder()
    label_encoder_department = LabelEncoder()
    label_encoder_college = LabelEncoder()

    dataset['Community'] = label_encoder_community.fit_transform(dataset['Community'])
    dataset['Branch Name'] = label_encoder_department.fit_transform(dataset['Branch Name'])
    dataset['College name'] = label_encoder_college.fit_transform(dataset['College name'])

    X = dataset[['Cutoff marks', 'Community', 'Branch Name']]
    y = dataset['College name']

    scaler = StandardScaler()
    X.loc[:, 'Cutoff marks'] = scaler.fit_transform(X[['Cutoff marks']])

    return X, y, label_encoder_community, label_encoder_department, label_encoder_college, scaler

def train_knn_model(X_train, y_train):
    model = KNeighborsClassifier(n_neighbors=3)
    model.fit(X_train, y_train)
    return model

def train_regression_model(X_train, y_train):
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

file_path = 'data_2023.csv'  # Specify the full local path to the CSV file
dataset = load_data(file_path)

if dataset is not None:
    X, y, label_encoder_community, label_encoder_department, label_encoder_college, scaler = preprocess_data(dataset)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    knn_model = train_knn_model(X_train, y_train)
    reg_model = train_regression_model(X_train[['Cutoff marks']], y_train)
else:
    print("Data loading failed. Please ensure the file exists in the specified path.")

@app.route('/app')
def request_ststes():
    return render_template("index.html")

@app.route('/prediction', methods=['GET'])
def test_app():
    return jsonify({"states":True})
@app.route('/prediction', methods=['POST'])
def predict_college():
    data = request.get_json()
    cutoff_mark =int(data.get('cutoff_mark'))
    community = data.get('community').strip().upper()
    department = data.get('course').strip().upper()
    # return jsonify({"cutoffmark":cutoff_mark,
    #                 "community":community,
    #                 "department":department
    #                 })
    missing_fields = []
    if not cutoff_mark:
        missing_fields.append("cutoff_mark")
    if not community:
        missing_fields.append("community")
    if not department:
        missing_fields.append("course")

    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    if community not in label_encoder_community.classes_:
        return jsonify({"error": f"Community '{community}' is not recognized."}), 400
    if department not in label_encoder_department.classes_:
        return jsonify({"error": f"Department '{department}' is not recognized."}), 400

    community_encoded = label_encoder_community.transform([community])[0]
    department_encoded = label_encoder_department.transform([department])[0]

    input_data = np.array([[cutoff_mark, community_encoded, department_encoded]])
    input_data[:, 0] = scaler.transform(input_data[:, [0]])

    distances, indices = knn_model.kneighbors(input_data, n_neighbors=len(X_train))

    nearest_colleges = X_train.iloc[indices[0]]
    eligible_colleges = dataset.iloc[indices[0]]
    eligible_colleges = eligible_colleges[
        (eligible_colleges['Community'] == community_encoded) &
        (eligible_colleges['Branch Name'] == department_encoded)
    ]

    result = []
    if not eligible_colleges.empty:
        # Inverse transform the encoded college names back to the original names
        eligible_college_names = label_encoder_college.inverse_transform(eligible_colleges['College name'])
    
        # Ensure College Code is numeric and handle potential issues
        eligible_college_codes = eligible_colleges['College Code'].values
        for name, code in zip(eligible_college_names, eligible_college_codes):
            if pd.notna(name):  # Check if name is not NaN
                result.append({"name": name, "code": int(code)})

    # Return the result as JSON with a 200 status code (default for successful requests)
        return jsonify({"pdata": result})

    else:
    # No eligible colleges found, return an empty list with a 200 status code
        return jsonify({"pdata": []})


if __name__ == '__main__':
    app.run(debug=True)
