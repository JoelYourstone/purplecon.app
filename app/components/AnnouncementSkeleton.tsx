import { View, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";

export function AnnouncementSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton colorMode="light" width={40} height={40} radius="round" />
        <View style={styles.headerText}>
          <Skeleton colorMode="light" width={120} height={16} />
          <Skeleton
            colorMode="light"
            width={80}
            height={12}
            style={{ marginTop: 4 }}
          />
        </View>
      </View>
      <Skeleton
        colorMode="light"
        width="100%"
        height={20}
        style={{ marginTop: 16 }}
      />
      <Skeleton
        colorMode="light"
        width="100%"
        height={20}
        style={{ marginTop: 8 }}
      />
      <Skeleton
        colorMode="light"
        width="80%"
        height={20}
        style={{ marginTop: 8 }}
      />
      <View style={styles.footer}>
        <Skeleton colorMode="light" width={60} height={16} />
        <Skeleton colorMode="light" width={60} height={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
