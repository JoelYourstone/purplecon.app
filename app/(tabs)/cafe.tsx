import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "@/theme";
import Feather from "@expo/vector-icons/build/Feather";
import { useScrollToTop } from "@react-navigation/native";
import React, { useState } from "react";
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

  const clearItem = (item: CafeItem) => {
    setCartItems((prevItems) => {
      const newItems: Record<number, CartItem> = { ...prevItems };
      delete newItems[item.id];
      if (Object.keys(newItems).length === 0) {
        setIsCartOpen(false);
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems(() => {
      return {};
    });
    setIsCartOpen(false);
  };

  const handleAddToCart = (item: CafeItem) => {
    increaseItemQuantity(item);
  };

  const countItems = () => {
    return Object.values(cartItems).reduce(
      (total, item) => total + item.quantity,
      0,
    );
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
            <Text style={styles.cartSummaryText}>
              {cartItem.quantity} x {cartItem.item.name}
            </Text>
            <View style={styles.clearItemContainer}>
              <TouchableOpacity onPress={() => clearItem(cartItem.item)}>
                <Feather name="trash-2" size={24} color={theme.colorPurple} />
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
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>{item.name}</Text>
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                handleAddToCart(item);
              }}
              style={styles.addToCartButton}
            >
              <Text style={styles.addToCartButtonText}>{item.price}:-</Text>
            </TouchableOpacity>
          </View>
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
      {countItems() > 0 && (
        <View style={styles.shoppingCartBadge}>
          <TouchableOpacity
            onPress={() => setIsCartOpen(true)}
            style={styles.shoppingCartTouchable}
          >
            <Text style={styles.buttonText}>{getTotalPrice()}:-</Text>
            <Feather name="shopping-cart" size={24} color="white" />
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCoutBadgeText}>{countItems()}</Text>
            </View>
          </TouchableOpacity>

          <Modal
            visible={isCartOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsCartOpen(false)}
          >
            <TouchableWithoutFeedback onPress={() => setIsCartOpen(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.cartPopup}>
                  <TouchableWithoutFeedback>
                    <View>
                      <Text style={styles.cartPopupTitle}>Dina varor</Text>
                      {renderCartSummary()}
                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          onPress={() => {
                            clearCart();
                          }}
                          style={styles.clearButton}
                        >
                          <Text style={styles.buttonText}>Rensa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(
                              `https://app.swish.nu/1/p/sw/?sw=0766313471&amt=${getTotalPrice()}&cur=SEK&msg=Purplecon Spelcafé&src=qr`,
                            );
                          }}
                          style={styles.swishButton}
                        >
                          <Text style={styles.buttonText}>Swish</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}
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
  addToCartButton: {
    backgroundColor: theme.colorPurple,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
  },
  addToCartButtonText: {
    color: theme.colorWhite,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  flatListContainer: {
    paddingTop: theme.space16,
  },
  shoppingCartBadge: {
    backgroundColor: theme.colorPurple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  shoppingCartTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCountBadge: {
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
  itemCoutBadgeText: {
    color: theme.colorWhite,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cartSummaryText: {
    flex: 4,
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
  cartPopup: {
    backgroundColor: theme.colorWhite,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  cartPopupTitle: {
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
  clearButton: {
    backgroundColor: theme.colorGrey,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
  },
  buttonText: {
    color: theme.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  clearItemContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
  },
});
