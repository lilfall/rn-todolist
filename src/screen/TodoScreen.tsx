import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedData, setSelectedData] = useState<DummyData>();

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

  //   clear all data
  const clearData = async () => {
    try {
      await AsyncStorage.clear();
      setData([]);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  //   delete data
  const deleteData = async (id: string) => {
    const filteredData = data?.filter((item) => item.id !== id);
    await AsyncStorage.setItem("todo-data", JSON.stringify(filteredData));
    setData(filteredData);
  };

  //   edit data
  const editData = async (item: DummyData) => {
    setIsEditMode(true);
    setTitle(item.title);
    setDescription(item.description);
    setImage(item.image);
    setSelectedData(item);
  };

  const updateData = async () => {
    const updatedData = data
      ?.map((item) => {
        if (item.id === selectedData?.id) {
          return { ...item, title, description, image };
        }
        return item;
      })
      .filter(Boolean);

    await AsyncStorage.setItem("todo-data", JSON.stringify(updatedData));
    console.log(updatedData);
    loadData();
    setIsEditMode(false);
    setImage("");
    setTitle("");
    setDescription("");
    setSelectedData(undefined);
  };

  useEffect(() => {
    loadData();
  }, []);

  const RenderItem = ({ item, index }: { item: DummyData; index: number }) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 4,
          padding: 4,
          borderWidth: 1,
          borderColor: "#CCC",
          borderRadius: 10,
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        {item.image != null && (
          <Image
            source={{ uri: item.image }}
            style={{ width: 50, height: 50, borderRadius: 5 }}
          />
        )}
        <View>
          <Text style={{ fontWeight: "800", fontSize: 16 }}>{item.title}</Text>
          <Text style={{ fontSize: 12 }}>{item.description}</Text>
        </View>
        <View style={{ paddingRight: 8 }}>
          <TouchableOpacity onPress={() => editData(item)}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteData(item.id ? item.id : "")}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

      {!isEditMode ? (
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
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: "#222",
            borderRadius: 10,
            alignItems: "center",
            paddingVertical: 8,
            marginTop: 16,
          }}
          onPress={updateData}
        >
          <Text style={{ color: "#FFF" }}>Save</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={clearData}>
        <Text>Clear All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log(data)}>
        <Text>Log Data</Text>
      </TouchableOpacity>

      {!isEditMode && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>Your Task</Text>
          {data && data.length > 0 ? (
            <FlatList
              style={{ marginTop: 16 }}
              data={data}
              renderItem={RenderItem}
            />
          ) : (
            <Text>Add Data First</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default TodoScreen;
