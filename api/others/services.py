from typing import Dict
from .models import Route
from auth.routes import verify_operator
from fastapi import HTTPException
import geopy.distance
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from .models import RouteOutput, ClusterOutput
from sklearn.cluster import KMeans

class RouteService:
    def __init__(self):
        pass
    def create_distmatrix(self, json: Dict):
        distance_matrix = []
        coords_dist = []
        
        dupe = []
        new_pickups = []
        coordinates = json["coordinates"]
        names = json["coords_name"]
        if "pickups_deliveries" in json.keys():
            pickups = json["pickups_deliveries"]
        else:
            pickups = []
        for pair in pickups:
            starting =  pair[0]
            ending = pair[1]
            if starting not in dupe:
                dupe.append(starting)
                index_s = starting
            else:
                S_coords = coordinates[starting]
                coordinates.append(S_coords)
                index_s = len(coordinates)-1
                names.append(names[starting])
            if ending not in dupe:
                dupe.append(ending)
                index_e = ending
            else:
                E_coords = coordinates[ending]
                coordinates.append(E_coords)
                index_e = len(coordinates)-1
                names.append(names[ending])
            new_pickups.append([index_s,index_e])
            
        for i in range(len(coordinates)):
            lat = coordinates[i][0]
            lon = coordinates[i][1]
            coords_tuple = (lat,lon)
            for j in range(len(coordinates)):
                lat = coordinates[j][0]
                lon = coordinates[j][1]
                coords1_tuple =(coordinates[j][0],coordinates[j][1])
                dist = geopy.distance.distance(coords_tuple, coords1_tuple).m
                coords_dist.append(int(dist))
            if json["round_trip"]==False:
                coords_dist.append(0)
            distance_matrix.append(coords_dist)
            coords_dist = []
        if json["round_trip"]==False:
            distance_matrix.append([0]*(len(coordinates)+1))
        return [distance_matrix,new_pickups,names]
    
    def optimize(self, obj: Dict):
        """Entry point of the program."""
        all = self.create_distmatrix(obj)
        #create distance matrix
        distance_matrix = all[0]
        # Instantiate the data problem.
        data = {}
        data["distance_matrix"] = distance_matrix
        if "num_drivers" not in obj.keys():
            obj["num_drivers"] = 1
        data['num_vehicles'] = obj["num_drivers"]
        data['starts'] = [0] * obj["num_drivers"]
        data['depot'] = 0
        if obj["round_trip"] == False:
            data['ends'] = [len(distance_matrix)-1] * obj["num_drivers"]
        else:
            data['ends'] = [0]* obj["num_drivers"]
            '''dupe = obj["coords_name"][0]
            obj["coords_name"].append(dupe)'''
        data['pickups_deliveries'] = all[1]
        names = all[2]
        
        print(data["num_vehicles"])
        # Create the routing index manager.
        manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                            data['num_vehicles'], data['starts'], data['ends'])

        # Create Routing Model.
        routing = pywrapcp.RoutingModel(manager)


        # Define cost of each arc.
        def distance_callback(from_index, to_index):
            """Returns the manhattan distance between the two nodes."""
            # Convert from routing variable Index to distance matrix NodeIndex.
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data['distance_matrix'][from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Add Distance constraint.
        dimension_name = 'Distance'
        routing.AddDimension(
            transit_callback_index,
            0,  # no slack
            30000000000000,  # vehicle maximum travel distance
            True,  # start cumul to zero
            dimension_name)
        distance_dimension = routing.GetDimensionOrDie(dimension_name)
        distance_dimension.SetGlobalSpanCostCoefficient(100)

        # Define Transportation Requests.
        for request in data['pickups_deliveries']:
            pickup_index = manager.NodeToIndex(request[0])
            delivery_index = manager.NodeToIndex(request[1])
            routing.AddPickupAndDelivery(pickup_index, delivery_index)
            routing.solver().Add(
                routing.VehicleVar(pickup_index) == routing.VehicleVar(
                    delivery_index))
            routing.solver().Add(
                distance_dimension.CumulVar(pickup_index) <=
                distance_dimension.CumulVar(delivery_index))

        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

        # Solve the problem.
        solution = routing.SolveWithParameters(search_parameters)

        # Print solution on console.
        if solution:
            returned = []
            solution_list = []
            for i in range(data["num_vehicles"]):
                next_index = routing.Start(i)
                solution_list.append(names[next_index])
                while not routing.IsEnd(next_index):
                    next_index = solution.Value(routing.NextVar(next_index))
                    try:
                        next = manager.IndexToNode(next_index)
                        solution_list.append(names[next])
                    except:
                        print("nope")
                    if solution_list[len(solution_list)-1] == solution_list[len(solution_list)-2] and len(solution_list)>=2:
                        solution_list.pop()
                returned.append(RouteOutput(name=f"Driver {i+1}", route=solution_list))
                solution_list = []
            return returned


class ClusterService:
    def __init__(self):
        pass
    def create_clusters(self, obj: Dict):
        coords = obj["coordinates"]
        num_clusters = obj["num_drivers"]

        #Convert coords to to lat long
        coords = [[float(i[0]),float(i[1])] for i in coords]

        #Initate Kmeans
        kmeans = KMeans(
            #init=cluster,
            n_clusters=num_clusters,
            n_init=10,
            max_iter=1,
            random_state=42
        )
        #Fit the model
        kmeans.fit(coords)
        labels = kmeans.labels_
        '''Return output in the form
        [clusteroutput(cluster_name="label",cluster = [list of coords])]'''
        coords = [[str(i[0]),str(i[1])] for i in coords]
        returned = []
        for i in range(num_clusters):
            cluster = []
            for j in range(len(labels)):
                if labels[j] == i:
                    cluster.append(coords[j])
            returned.append(ClusterOutput(cluster_name=f"Cluster {i+1}", cluster=cluster))
        return returned

        
    

  

    

