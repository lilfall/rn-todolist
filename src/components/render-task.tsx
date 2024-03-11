import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { DummyData } from "../screen/TodoScreen";

type Props = {};

const RenderTask = ({ data }: { data: DummyData[] | undefined }) => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 24, textAlign: "center" }}>Your Task</Text>
      <FlatList style={{ marginTop: 16 }} data={data} renderItem={RenderItem} />
    </View>
  );
};

export default RenderTask;

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
      <Image
        source={{ uri: item.image }}
        style={{ width: 50, height: 50, borderRadius: 5 }}
      />
      <View>
        <Text style={{ fontWeight: "800", fontSize: 16 }}>{item.title}</Text>
        <Text style={{ fontSize: 12 }}>{item.description}</Text>
      </View>
      <View style={{ paddingRight: 8 }}>
        <TouchableOpacity>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
