import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "@/theme";
import Feather from "@expo/vector-icons/build/Feather";
import { useScrollToTop } from "@react-navigation/native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const [isCartEditMode, setIsCartEditMode] = useState(false);

  const handleSetIsCartOpen = (value: boolean) => {
    setIsCartOpen(value);
    if (!value) {
      setIsCartEditMode(false);
    }
  };

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
      if (Object.keys(newItems).length === 0) {
        handleSetIsCartOpen(false);
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems(() => {
      return {};
    });
    handleSetIsCartOpen(false);
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
            {isCartEditMode && (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => decreaseItemQuantity(cartItem.item)}
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
                >
                  <Feather
                    name="plus-square"
                    size={24}
                    color={theme.colorPurple}
                  />
                </TouchableOpacity>
              </View>
            )}
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
      title: "Snacks",
      data: [
        { name: "Chips/popcornbägare (fri påfyllning)", price: 15 },
        { name: "Snickers/Smarties", price: 5 },
        { name: "Bilar", price: 15 },
        { name: "Haribo godispåse", price: 10 },
        { name: "Vegansk godispåse", price: 10 },
        { name: "Delicatoboll (vegansk)", price: 5 },
        { name: "Kladdkakecookies", price: 5 },
      ].map((item, index) => ({ ...item, id: `snacks-${index}` })),
    },
    {
      title: "Dryck",
      data: [
        { name: "Läsk", price: 10 },
        { name: "Cider", price: 15 },
      ].map((item, index) => ({ ...item, id: `dryck-${index}` })),
    },
    {
      title: "Mat",
      data: [
        { name: "Pizza/pirog (kött/vegansk finns)", price: 20 },
        { name: "Bygg din egen pastasallad", price: 40 },
      ].map((item, index) => ({ ...item, id: `mat-${index}` })),
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={menuSections}
        keyExtractor={(item: CafeItem) => item.id}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                handleAddToCart(item);
              }}
            >
              <View style={{ flexDirection: "column", gap: 4 }}>
                <Text style={[styles.menuText, { fontWeight: "bold" }]}>
                  {item.name}
                </Text>
                <Text style={styles.menuText}>{item.price}:-</Text>
              </View>
              <Feather
                name="plus-circle"
                size={24}
                color={theme.colorPurple}
                style={{ verticalAlign: "middle" }}
              />
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
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
      <View>
        <View
          style={{
            borderTopColor: theme.colorPurple,
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        />
        <TouchableOpacity
          onPress={() => handleSetIsCartOpen(true)}
          style={styles.payNowButton}
        >
          {countItems() > 0 ? (
            <Text style={styles.payNowButtonText}>
              Betala {getTotalPrice()}:- för {countItems()}{" "}
              {countItems() > 1 ? "varor" : "vara"}
            </Text>
          ) : (
            <Text style={styles.payNowButtonText}>Din varukorg är tom</Text>
          )}
        </TouchableOpacity>

        <Modal
          visible={isCartOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => handleSetIsCartOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => handleSetIsCartOpen(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.cartPopup}>
                <TouchableWithoutFeedback>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.cartPopupTitle}>Dina varor</Text>
                        <TouchableOpacity onPress={() => clearCart()}>
                          <Feather
                            name="trash-2"
                            size={24}
                            color={theme.colorPurple}
                            style={{
                              alignSelf: "center",
                              marginLeft: 8,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={{ alignSelf: "flex-end" }}
                        onPress={() => setIsCartEditMode(!isCartEditMode)}
                      >
                        <Feather
                          name="edit"
                          size={24}
                          color={theme.colorPurple}
                        />
                      </TouchableOpacity>
                    </View>
                    {renderCartSummary()}
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(
                          `https://app.swish.nu/1/p/sw/?sw=0766313471&amt=${getTotalPrice()}&cur=SEK&msg=Purplecon Spelcafé&src=qr`,
                        );
                      }}
                      style={styles.swishButton}
                    >
                      <Text style={styles.swishButtonText}>Swish</Text>
                    </TouchableOpacity>
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
  payNowButton: {
    backgroundColor: theme.colorPurple,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginHorizontal: 16,
  },
  payNowButtonText: {
    color: theme.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
    fontSize: 16,
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
  swishButton: {
    backgroundColor: theme.colorPurple,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginHorizontal: 16,
  },
  swishButtonText: {
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
    gap: 4,
  },
  quantity: {
    marginHorizontal: 4,
    fontSize: 16,
  },
});
