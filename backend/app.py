import pandas as pd
from flask import Flask, request, jsonify
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def load_and_aggregate_data(file_paths):
    data_frames = [pd.read_csv(file) for file in file_paths]
    combined_data = pd.concat(data_frames, ignore_index=True)
    
    combined_data = combined_data.dropna(subset=['Cutoff marks', 'Community', 'Branch Name', 'College Name', 'College Code'])
    combined_data = combined_data[combined_data['Cutoff marks'] >= 70]
    
    aggregated_data = combined_data.groupby(['Community', 'Branch Name', 'College Name', 'College Code'])['Cutoff marks'].mean().reset_index()
    
    return aggregated_data

def preprocess_data(dataset):
    # Label encoding for categorical columns
    label_encoder_community = LabelEncoder()
    label_encoder_department = LabelEncoder()
    label_encoder_college = LabelEncoder()

    dataset['Community'] = label_encoder_community.fit_transform(dataset['Community'])
    dataset['Branch Name'] = label_encoder_department.fit_transform(dataset['Branch Name'])
    dataset['College Name'] = label_encoder_college.fit_transform(dataset['College Name'])


    X = dataset[['Cutoff marks', 'Community', 'Branch Name']]
    y = dataset[['College Name', 'College Code']]


    scaler = StandardScaler()
    X['Cutoff marks'] = scaler.fit_transform(X[['Cutoff marks']].copy())

    return X, y, label_encoder_community, label_encoder_department, label_encoder_college, scaler

def get_nearest_colleges(X_train, y_train, input_data, k=100):
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train['College Name'])
    
    neighbors_indices = knn.kneighbors([input_data], n_neighbors=k, return_distance=False)
    
    nearest_colleges_info = []
    for idx in neighbors_indices[0]:
        college_name = y_train['College Name'].iloc[idx]
        college_code = y_train['College Code'].iloc[idx]
        nearest_colleges_info.append({'name': college_name, 'code': college_code})
    

    seen = set()
    unique_colleges_info = []
    for college in nearest_colleges_info:
        if college['code'] not in seen:
            unique_colleges_info.append(college)
            seen.add(college['code'])

    return unique_colleges_info


file_paths = [
    'data_2019.csv',
    'data_2020.csv',
    'data_2021.csv',
    'data_2022.csv',
    'data_2023.csv'
]
dataset = load_and_aggregate_data(file_paths)
X, y, label_encoder_community, label_encoder_department, label_encoder_college, scaler = preprocess_data(dataset)

@app.route('/', methods=['GET'])
def test_fun():
    return jsonify({"status": True})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        cutoff_mark = int(data['cutoff'])
        community = data['community']
        department = data['department']

        if cutoff_mark < 70 or cutoff_mark > 200:
            return jsonify({'errorsts':True,'error': 'Cutoff mark must be between 70 and 200'}), 200

        if community not in label_encoder_community.classes_:
            return jsonify({'errorsts':True,'error': f"Community '{community}' is not recognized"}), 200

        if department not in label_encoder_department.classes_:
            return jsonify({'errorsts':True,'error': f"Department '{department}' is not recognized"}), 200

        community_encoded = label_encoder_community.transform([community])[0]
        department_encoded = label_encoder_department.transform([department])[0]
        cutoff_scaled = scaler.transform([[cutoff_mark]])[0][0]

        input_data = [cutoff_scaled, community_encoded, department_encoded]

        nearest_colleges_info = get_nearest_colleges(X, y, input_data, k=10)

        result = []
        for college in nearest_colleges_info:
            college_name_decoded = label_encoder_college.inverse_transform([college['name']])[0]
            result.append({
                'name': college_name_decoded,
                'code': int(college['code'])
            })

        return jsonify({'errorsts':False,'colleges': result})

    except Exception as e:
        return jsonify({'errorsts':True,'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
