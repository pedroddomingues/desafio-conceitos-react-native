import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api'

export default function App() {
  const [ repositories, setRepositories ] = useState([])

  useEffect(() => {
    api.get('repositories').then(response => setRepositories(response.data))
  }, [])

  async function handleLikeRepository(id) {
    const repoI = repositories.findIndex(repo => repo.id === id)

    const response = await api.post(`repositories/${id}/like`)

    repositories[repoI] = {...repositories[repoI], likes: response.data.likes}

    setRepositories([...repositories])
  }

  async function handleDeleteRepository(id) {
    const repoI = repositories.findIndex(repo => repo.id === id)

    await api.delete(`repositories/${id}`)

    repositories.splice(repoI,1)

    setRepositories([...repositories])
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
        data={repositories}
        keyExtractor={repo => repo.id}
        renderItem={({ item: repository }) => (
          <View style={styles.repositoryContainer}>
            <Text style={styles.repository}>{repository.title}</Text>

            <View style={styles.techsContainer}>
            {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
            ))}
            </View>
            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${repository.id}`}
              >
                {`${repository.likes} curtidas`}
              </Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repository.id}`}
                >
                <Text style={styles.buttonLikeText}>Curtir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDeleteRepository(repository.id)}
                >
                <Text style={styles.buttonDeleteText}>Apagar</Text>
              </TouchableOpacity>
            </View>
        </View>
        )}
        >
        </FlatList>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  }, 
  buttons: {
    flexDirection: "row"
  },
  button: {
    marginTop: 10,
  },
  buttonLikeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "pink",
    padding: 15,
  },
  buttonDeleteText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "red",
    padding: 15,
  }
});
