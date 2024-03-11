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
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import RenderTask from "../components/render-task";

type Props = {};

export type DummyData = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const dummyData: DummyData[] = [
  {
    id: "01",
    title: "First Task",
    description: "First Desctiption",
    image:
      "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Frn-todolist-e5155bc3-4dae-4e33-9c82-aee58bcae27b/ImagePicker/36514268-076f-43e1-8220-9c659d0e00f7.jpeg",
  },
];

const TodoScreen = (props: Props) => {
  const [image, setImage] = useState<string | undefined>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
        // onChangeText={handleTextChange}
        // value={text}
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
      >
        <Text style={{ color: "#FFF" }}>Add</Text>
      </TouchableOpacity>
      <RenderTask data={dummyData} />
    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({});
