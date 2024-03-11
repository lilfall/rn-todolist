import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import RenderTask from "../components/render-task";

type Props = {};

export type DummyData = {
  id: string | undefined;
  title: string | undefined;
  description: string | undefined;
  image: string | undefined;
};

const TodoScreen = (props: Props) => {
  const [image, setImage] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [data, setData] = useState<DummyData[]>();

  //   select image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // get data
  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("todo-data");
      if (savedData !== null) {
        setData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  //   Menyimpan data
  const saveData = async () => {
    // mengambil value dari state
    let value: DummyData = {
      id: Date.now().toString(),
      title: title,
      description: description,
      image: image,
    };

    try {
      // get data
      let existingData = await AsyncStorage.getItem("todo-data");
      console.log(existingData);
      if (existingData != null) {
        // ubah string
        let parsedData = JSON.parse(existingData);

        if (!existingData) return;
        // masukan ke type
        const convert: DummyData[] = parsedData;
        // tambahkan data
        convert.push(value);
        await AsyncStorage.setItem("todo-data", JSON.stringify(convert));
      } else {
        await AsyncStorage.setItem("todo-data", JSON.stringify([value]));
      }
      loadData();
    } catch (e) {
      console.log("Error", e);
    }

    setImage("");
    setTitle("");
    setDescription("");
  };

  const clearData = async () => {
    try {
      await AsyncStorage.clear();
      setData([]);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={{ padding: 8, marginHorizontal: 16, marginVertical: 16 }}>
      <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 24 }}>
        To do list
      </Text>
      <TextInput
        style={{
          borderColor: "#CCC",
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 6,
          paddingHorizontal: 16,
        }}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Task Title..."
      />
      <TextInput
        style={{
          borderColor: "#CCC",
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 6,
          paddingHorizontal: 16,
          marginTop: 16,
        }}
        placeholder="Task Description..."
        multiline={true}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: "#222",
          borderRadius: 10,
          alignItems: "center",
          paddingVertical: 8,
          marginTop: 16,
          width: 200,
        }}
      >
        <Text style={{ color: "#FFF" }}>Select Picture</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 16 }}>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        )}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#222",
          borderRadius: 10,
          alignItems: "center",
          paddingVertical: 8,
          marginTop: 16,
        }}
        onPress={saveData}
      >
        <Text style={{ color: "#FFF" }}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearData}>
        <Text>Clear All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log(data)}>
        <Text>Log Data</Text>
      </TouchableOpacity>

      <RenderTask data={data} />
    </View>
  );
};

export default TodoScreen;
