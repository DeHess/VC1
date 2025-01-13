from deepface import DeepFace

result = DeepFace.verify(
  img1_path = "me3.jpg",
  img2_path = "me4.jpg",
  enforce_detection=False
)

print(str(result))


dfs = DeepFace.find(
  img_path = "gf1.jpg",
  db_path = "C:/Users/nathh/GitHub/FaceDetection",
)

#print(dfs)

objs = DeepFace.analyze(
  img_path = "gf3.jpg", 
  actions = ['age', 'gender', 'race', 'emotion'],
)

#print(objs)