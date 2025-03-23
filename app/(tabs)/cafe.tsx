import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "@/theme";
import Feather from "@expo/vector-icons/build/Feather";
import { useScrollToTop } from "@react-navigation/native";
import React, { useState } from "react";
import { Button } from "@/components/Button";
import { CafeItem, MenuSection, CartItem } from "@/types";
import {
  View,
  SectionList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";

// import { theme } from "@/theme";
import { FlatList } from "react-native-gesture-handler";

export default function Cafe() {
  const scrollRef = React.useRef<FlatList>(null);
  useScrollToTop(scrollRef);

  const [cartItems, setCartItems] = useState<Record<number, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const increaseItemQuantity = (item: CafeItem) => {
    setCartItems((prevItems) => {
      const newItems: Record<number, CartItem> = { ...prevItems };
      if (newItems[item.id]) {
        newItems[item.id].quantity += 1;
      } else {
        newItems[item.id] = { item, quantity: 1 };
      }
      return newItems;
    });
  };

  const decreaseItemQuantity = (item: CafeItem) => {
    setCartItems((prevItems) => {
      const newItems: Record<number, CartItem> = { ...prevItems };
      newItems[item.id].quantity -= 1;
      if (newItems[item.id].quantity === 0) {
        delete newItems[item.id];
      }

      return newItems;
    });
  };

  const handleAddToCart = (item: CafeItem) => {
    increaseItemQuantity(item);
  };

  const getTotalPrice = () => {
    return Object.values(cartItems).reduce(
      (total, item) => total + item.quantity * item.item.price,
      0,
    );
  };

  const renderCartSummary = () => {
    return (
      <View>
        {Object.values(cartItems).map((cartItem: CartItem) => (
          <View key={cartItem.item.id} style={styles.cartItemsRow}>
            <Text style={styles.cartSummaryText}>{cartItem.item.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => decreaseItemQuantity(cartItem.item)}
                style={styles.quantityButton}
              >
                <Feather
                  name="minus-square"
                  size={24}
                  color={theme.colorPurple}
                />
              </TouchableOpacity>
              <Text style={styles.quantity}>{cartItem.quantity}</Text>
              <TouchableOpacity
                onPress={() => increaseItemQuantity(cartItem.item)}
                style={styles.quantityButton}
              >
                <Feather
                  name="plus-square"
                  size={24}
                  color={theme.colorPurple}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.cartItemTotal}>
              {cartItem.quantity * cartItem.item.price}:-
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View key={"cart_total"} style={styles.cartSummaryRow}>
          <Text style={styles.cartTotalText}>Totalt</Text>
          <Text style={styles.cartTotalText}>{getTotalPrice()}:-</Text>
        </View>
      </View>
    );
  };

  const menuSections: MenuSection[] = [
    {
      title: "Dryck",
      data: [
        { id: 1, name: "Läsk", price: 10 },
        { id: 2, name: "Cider", price: 15 },
        { id: 3, name: "Hot Chocolate", price: 4.0 },
        { id: 4, name: "Iced Coffee", price: 4.0 },
        { id: 5, name: "Iced Tea", price: 3.0 },
        { id: 6, name: "Iced Chocolate", price: 4.5 },
      ],
    },
    {
      title: "Snacks",
      data: [
        { id: 7, name: "Cookie", price: 5 },
        { id: 8, name: "Chokladboll", price: 5 },
        { id: 9, name: "Chokladstycksak", price: 10 },
      ],
    },
    {
      title: "Mat",
      data: [
        { id: 10, name: "Pizza", price: 20 },
        { id: 11, name: "Pirog", price: 15 },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={menuSections}
        keyExtractor={(item: CafeItem) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => {
              handleAddToCart(item);
            }}
          >
            <Text style={styles.menuText}>{item.name}</Text>
            <Text style={styles.menuText}>{item.price}:-</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedView
            style={styles.sectionHeader}
            lightColor={theme.colorWhite}
            darkColor={theme.colorDarkBlue}
          >
            <ThemedText fontWeight="bold" fontSize={20}>
              {title}
            </ThemedText>
          </ThemedView>
        )}
        contentContainerStyle={styles.flatListContainer}
      />

      <View style={styles.floatingBadge}>
        <TouchableOpacity
          onPress={() => setIsCartOpen(true)}
          style={styles.floatingBadgeTouchable}
        >
          <Feather name="shopping-cart" size={24} color="white" />
          {Object.values(cartItems).reduce(
            (total, item) => total + item.quantity,
            0,
          ) > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {Object.values(cartItems).reduce(
                  (total, item) => total + item.quantity,
                  0,
                )}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Modal
          visible={isCartOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsCartOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsCartOpen(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.sidePanel}>
                <TouchableWithoutFeedback>
                  <View>
                    <Text style={styles.sidePanelTitle}>Dina varor</Text>
                    {Object.keys(cartItems).length > 0 ? (
                      renderCartSummary()
                    ) : (
                      <Text style={styles.emptyCartText}>
                        Du har inte valt några varor.
                      </Text>
                    )}
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsCartOpen(false);
                        }}
                        style={styles.closeButton}
                      >
                        <Text style={styles.closeButtonText}>Stäng</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            `https://app.swish.nu/1/p/sw/?sw=0766313471&amt=${cartTotal}&cur=SEK&msg='Purplecon Spelcafé'&src=qr`,
                          );
                        }}
                        style={styles.swishButton}
                      >
                        <Text style={styles.swishButtonText}>Swish</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colorWhite,
  },
  sectionHeader: {
    backgroundColor: theme.colorPurple,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  menuText: {
    color: theme.colorBlack,
    fontSize: 16,
  },
  flatListContainer: {
    paddingTop: theme.space16,
  },
  floatingBadge: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: theme.colorPurple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingBadgeTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: theme.colorRed,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: theme.colorWhite,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cartSummaryText: {
    flex: 1,
    fontSize: 14,
    color: theme.colorBlack,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colorGrey,
    marginVertical: 8,
  },
  cartTotalText: {
    fontSize: 18,
    color: theme.colorBlack,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sidePanel: {
    backgroundColor: theme.colorWhite,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  sidePanelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cartItemsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cartSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cartItemTotal: {
    flex: 1,
    fontSize: 14,
    color: theme.colorBlack,
    fontWeight: "bold",
    textAlign: "right",
  },
  emptyCartText: {
    fontSize: 16,
    color: theme.colorBlack,
    textAlign: "center",
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 16,
  },
  swishButton: {
    backgroundColor: theme.colorPurple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
  },
  swishButtonText: {
    color: theme.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: theme.colorGrey,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
  },
  closeButtonText: {
    color: theme.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  quantity: {
    alignContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
  },
  quantityButton: {
    padding: 0,
  },
});
