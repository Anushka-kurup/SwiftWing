from flask import Flask, request, jsonify
from sklearn.cluster import KMeans
from typing import Dict
from models import ClusterOutput
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class ClusterService:
    def __init__(self):
        pass
    
    @app.route('/optimize/cluster', methods=['POST'])
    def create_clusters():
        obj = request.get_json()
        coords = obj["coordinates"]
        num_clusters = obj["num_drivers"]

        # Convert coords to lat long
        coords = [[float(i[0]), float(i[1])] for i in coords]

        # Initiate Kmeans
        kmeans = KMeans(
            n_clusters=num_clusters,
            n_init=10,
            max_iter=1,
            random_state=42
        )
        # Fit the model
        kmeans.fit(coords)
        labels = kmeans.labels_

        # Return output in the form [clusteroutput(cluster_name="label",cluster=[list of coords])]
        coords = [[str(i[0]), str(i[1])] for i in coords]
        returned = []
        for i in range(num_clusters):
            cluster = []
            for j in range(len(labels)):
                if labels[j] == i:
                    cluster.append(coords[j])
            returned.append({"cluster_name":f"Cluster {i+1}", "cluster":cluster})
        return jsonify(returned)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
