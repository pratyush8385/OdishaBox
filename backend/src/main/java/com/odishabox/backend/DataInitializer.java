package com.odishabox.backend;

import com.odishabox.backend.model.*;
import com.odishabox.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository,
                           ProductRepository productRepository, CouponRepository couponRepository,
                           AddressRepository addressRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@odishabox.com")) {
            User admin = new User(
                    "admin@odishabox.com",
                    passwordEncoder.encode("admin123"),
                    "OdishaBox Admin",
                    "+917008512081",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
        }

        User customer = null;
        if (!userRepository.existsByEmail("user@odishabox.com")) {
            customer = new User(
                    "user@odishabox.com",
                    passwordEncoder.encode("user123"),
                    "Soumya Ranjan",
                    "+919988776655",
                    Role.ROLE_USER
            );
            customer = userRepository.save(customer);

            Address address = new Address();
            address.setUser(customer);
            address.setName("Home (Arekere)");
            address.setStreetAddress("Chithaary Aastha, Syndicate Bank Colony Main Rd, Syndicate Bank Colony, Omkar Nagar, Arekere");
            address.setCity("Bengaluru");
            address.setState("Karnataka");
            address.setZipCode("560076");
            address.setPhoneNumber("+919988776655");
            address.setDefault(true);
            addressRepository.save(address);
            
            Address workAddress = new Address();
            workAddress.setUser(customer);
            workAddress.setName("Office (Whitefield)");
            workAddress.setStreetAddress("Building 4B, RMZ Ecospace, Outer Ring Road");
            workAddress.setCity("Bengaluru");
            workAddress.setState("Karnataka");
            workAddress.setZipCode("560103");
            workAddress.setPhoneNumber("+919988776655");
            workAddress.setDefault(false);
            addressRepository.save(workAddress);
        }

        Category sweets = categoryRepository.findBySlug("sweets")
                .orElseGet(() -> categoryRepository.save(new Category("Sweets", "Authentic Odia dry sweets and desserts", "sweets.jpg", "sweets")));

        Category freshSweets = categoryRepository.findBySlug("fresh-sweets")
                .orElseGet(() -> categoryRepository.save(new Category("Fresh Sweets", "Fresh milk and cheese-based traditional Odia sweets", "fresh_sweets.jpg", "fresh-sweets")));

        Category pitha = categoryRepository.findBySlug("pitha")
                .orElseGet(() -> categoryRepository.save(new Category("Pitha", "Traditional steamed or fried Odia pancakes and dumplings", "pitha.jpg", "pitha")));

        Category grocery = categoryRepository.findBySlug("grocery")
                .orElseGet(() -> categoryRepository.save(new Category("Grocery", "Daily staples, puffed rice, flattened rice, and organic flours", "grocery.jpg", "grocery")));

        Category spices = categoryRepository.findBySlug("spices")
                .orElseGet(() -> categoryRepository.save(new Category("Spices", "Authentic regional spice mixes and powders from Odisha", "spices.jpg", "spices")));

        Category pickles = categoryRepository.findBySlug("pickles")
                .orElseGet(() -> categoryRepository.save(new Category("Pickles", "Homemade sweet, sour, and savory pickles from Odisha", "pickles.jpg", "pickles")));

        Category snacks = categoryRepository.findBySlug("snacks")
                .orElseGet(() -> categoryRepository.save(new Category("Snacks", "Traditional dry snacks, muan, and mixture to go with tea", "snacks.jpg", "snacks")));

        Category combo = categoryRepository.findBySlug("festival-boxes")
                .orElseGet(() -> categoryRepository.save(new Category("Festival Boxes", "Specially curated combos and festival special boxes", "combos.jpg", "festival-boxes")));

        if (productRepository.count() == 0) {
            // Sweets Category
            createProduct("Khaja", "Famous crispy, multi-layered sweet from the holy city of Puri. Made from refined flour and dipped in sugar syrup.", sweets, 180.0, 5.0, 4.8, "500 g", 100, "khaja.jpg", "Refined Flour (Maida), Ghee, Sugar, Cardamom", "Energy: 420 kcal, Fat: 18g, Protein: 4g, Carbs: 60g per 100g", "30 Days", false, true, false);
            createProduct("Gaja", "A sweet made by combining chhena (cottage cheese) and semolina, shaping it into rectangular blocks, deep frying, and soaking in syrup.", sweets, 170.0, 10.0, 4.6, "500 g", 40, "gaja.jpg", "Chhena, Semolina, Sugar, Cardamom, Ghee", "Energy: 340 kcal, Fat: 15g, Protein: 8g, Carbs: 45g per 100g", "10 Days", false, false, false);

            // Fresh Sweets Category
            createProduct("Chhena Poda", "The crown jewel of Odia sweets. Baked cottage cheese dessert caramelized with sugar. Prepared traditional way with sal leaves.", freshSweets, 320.0, 10.0, 4.9, "500 g", 50, "chhena_poda.jpg", "Chhena (Paneer), Sugar, Semolina, Cardamom, Ghee", "Energy: 310 kcal, Fat: 14g, Protein: 11g, Carbs: 35g per 100g", "7 Days", true, false, false);
            createProduct("Chhena Jhili", "Famous sweet from Nimapada, Odisha. Soft, juicy fried cottage cheese cardamoms carded in light sugar syrup.", freshSweets, 300.0, 5.0, 4.7, "500 g", 45, "chhena_jhili.jpg", "Chhena, Semolina, Cardamom, Sugar syrup", "Energy: 290 kcal, Fat: 11g, Protein: 7g, Carbs: 40g per 100g", "5 Days", false, true, false);
            createProduct("Rasabali", "Deep-fried flattened reddish-brown cheese patties soaked in thick, sweetened seasoned milk (rabri). Sourced from Kendrapara.", freshSweets, 350.0, 0.0, 4.8, "500 g", 30, "rasabali.jpg", "Chhena, Milk, Sugar, Cardamom, Ghee", "Energy: 280 kcal, Fat: 12g, Protein: 9g, Carbs: 30g per 100g", "3 Days", true, false, false);

            // Pitha Category
            createProduct("Arisa Pitha", "Traditional deep-fried sweet pancake made of rice flour and jaggery, topped with sesame seeds. Crispy on the outside, soft inside.", pitha, 220.0, 5.0, 4.7, "500 g", 60, "arisa.jpg", "Rice flour, Jaggery, Sesame seeds, Ghee", "Energy: 380 kcal, Carbs: 65g, Fat: 12g, Protein: 4g per 100g", "15 Days", false, false, false);
            createProduct("Kakara Pitha", "Classic sweet pancake filled with delicious coconut-jaggery stuffing. Popularly prepared during festivals.", pitha, 250.0, 5.0, 4.6, "500 g", 50, "kakara.jpg", "Semolina (Suji), Coconut, Jaggery, Cardamom, Fennel seeds", "Energy: 310 kcal, Carbs: 55g, Fat: 8g, Protein: 5g per 100g", "7 Days", false, false, false);
            createProduct("Manda Pitha", "Steamed sweet dumpling with coconut and jaggery filling, flavored with cardamom. Soft, warm and comforting.", pitha, 240.0, 0.0, 4.5, "500 g", 40, "manda.jpg", "Rice flour, Coconut, Jaggery, Cardamom, Black pepper", "Energy: 210 kcal, Carbs: 45g, Protein: 3g, Fat: 2g per 100g", "3 Days", false, false, false);

            // Grocery Category
            createProduct("Badi", "Light, crispy sun-dried lentil dumplings made of black gram paste. Can be fried and served as a crunchy side dish. Sourced from Keonjhar.", grocery, 140.0, 0.0, 4.8, "250 g", 75, "badi.jpg", "Black Gram (Biri), Spices, Sesame Seeds", "Energy: 320 kcal, Protein: 22g, Carbs: 58g, Fat: 1.5g per 100g", "90 Days", true, false, false);
            createProduct("Ambula", "Salted sun-dried green mango halves. Widely used in Odia cuisine for souring curries like Dalma and fish dishes.", grocery, 130.0, 0.0, 4.9, "200 g", 80, "ambula.jpg", "Raw Mango, Salt", "Energy: 120 kcal, Carbs: 28g, Sodium: 1200mg per 100g", "180 Days", false, false, false);
            createProduct("Mandia Flour", "Nutritious Ragi (Finger Millet) flour. Highly popular in Odisha for preparing Mandia Jau (porridge) and healthy pithas.", grocery, 120.0, 5.0, 4.5, "1 kg", 120, "mandia.jpg", "100% Finger Millet (Ragi)", "Energy: 336 kcal, Protein: 7.3g, Iron: 3.9mg, Dietary Fiber: 11.5g per 100g", "90 Days", false, true, false);
            createProduct("Chuda", "Premium quality flattened rice (poha) sourced from Odisha. Perfect for breakfast snacks like Chuda Santula or Chuda Ghasa.", grocery, 95.0, 0.0, 4.6, "1 kg", 100, "chuda.jpg", "100% Flattened Rice", "Energy: 346 kcal, Carbs: 77g, Protein: 6g per 100g", "90 Days", false, false, false);
            createProduct("Mudi", "Traditional crispy puffed rice of Baripada. Extra crunchy, large grains, perfect for making Jhalmudi or Jhua Mudi.", grocery, 70.0, 0.0, 4.7, "500 g", 150, "mudi.jpg", "100% Puffed Rice", "Energy: 325 kcal, Carbs: 80g, Protein: 6g per 100g", "60 Days", false, false, false);
            createProduct("Mustard Oil (Wood Pressed)", "Pure wood-pressed (Kolhu) mustard oil. Retains all natural nutrients and sharp aroma. Essential for authentic Odia curries.", grocery, 260.0, 5.0, 4.8, "1 L", 80, "mustard_oil.jpg", "100% Pure Mustard Seeds", "Energy: 884 kcal, Fat: 100g per 100ml", "365 Days", false, false, false);

            // Spices Category
            createProduct("Dalma Masala", "Authentic spice blend formulated specifically for Dalma, the traditional lentil and vegetable stew of Odisha.", spices, 80.0, 5.0, 4.7, "100 g", 110, "dalma_masala.jpg", "Cumin, Coriander, Cinnamon, Cardamom, Ginger, Roasted chili", "Energy: 260 kcal per 100g", "180 Days", false, false, false);
            createProduct("Besara Masala", "Traditional mustard spice blend essential for preparing Machha Besara (fish in mustard gravy) and other classic Odia dishes.", spices, 85.0, 5.0, 4.7, "100 g", 100, "besara_masala.jpg", "Mustard seeds, Cumin, Garlic, Dry chili", "Energy: 280 kcal per 100g", "180 Days", false, false, false);

            // Pickles Category
            createProduct("Fish Pickle", "Rich, spicy and sour local fish pickle prepared home-style with select spices and pure mustard oil.", pickles, 350.0, 10.0, 4.8, "250 g", 60, "fish_pickle.jpg", "Local Fish, Mustard Oil, Vinegar, Lemon juice, Spices, Salt", "Energy: 340 kcal, Fat: 22g, Protein: 18g per 100g", "180 Days", true, true, false);

            // Snacks (retained for layout compatibility)
            createProduct("Puri Lia Muan", "Sweet puff rice balls bound with rich liquid jaggery, flavored with ginger and cardamom. An essential Jagannath temple prasad.", snacks, 70.0, 0.0, 4.5, "6 Pcs", 150, "muan.jpg", "Puffed Rice (Lia), Jaggery, Coconut flakes, Ginger, Cardamom", "Energy: 350 kcal, Carbs: 78g, Protein: 3g per 100g", "45 Days", false, false, false);
            createProduct("Special Odia Mixture", "A crunchy tea-time snack mixture consisting of gram flour sev, peanuts, cashews, curry leaves, and traditional spices.", snacks, 85.0, 5.0, 4.7, "250 g", 110, "mixture.jpg", "Gram Flour, Peanuts, Cashew Nuts, Mustard Oil, Salt, Curry Leaves, Chili Powder", "Energy: 510 kcal, Fat: 28g, Protein: 12g, Carbs: 45g per 100g", "60 Days", true, false, false);

            // Combos (retained for layout compatibility)
            createProduct("Raja Festival Special Box", "Celebrate Raja festival in Bengaluru! Includes 1 slice of baked Poda Pitha, Chhena Poda, Lia Muan, and Odia mixture.", combo, 799.0, 15.0, 4.9, "1.5 kg", 25, "raja_box.jpg", "Assorted (Poda Pitha, Chhena Poda, Muan, Mixture)", "Mixed Nutritional Value", "5 Days", false, false, true);
            createProduct("Rath Yatra Mahaprasad Box", "Receive blessing of Lord Jagannath. Contains Puri Khaja, Gaja, Muan, and Sun-dried Keonjhar Phula Badi.", combo, 599.0, 10.0, 4.8, "1.2 kg", 35, "rath_box.jpg", "Assorted (Khaja, Gaja, Muan, Phula Badi)", "Mixed Nutritional Value", "15 Days", false, false, true);
            createProduct("OdishaBox Family Feast Combo", "Curated for the ultimate Odia food lover. Features Chhena Poda (500g), Puri Khaja (500g), Odia Mixture, Mango Pickle, and Phula Badi.", combo, 1299.0, 20.0, 4.9, "2.5 kg", 20, "family_box.jpg", "Assorted Sweets, Pickles, Groceries and Snacks", "Mixed Nutritional Value", "10 Days", true, false, false);
        }

        if (couponRepository.count() == 0) {
            couponRepository.save(new Coupon("WELCOME10", 10.0, 150.0, 399.0, LocalDate.now().plusMonths(3), true));
            couponRepository.save(new Coupon("RATHAYATRA25", 25.0, 100.0, 499.0, LocalDate.now().plusWeeks(2), true));
            couponRepository.save(new Coupon("ODISHALOVE", 15.0, 200.0, 799.0, LocalDate.now().plusMonths(6), true));
        }
    }

    private Product createProduct(String name, String description, Category category, double price,
                                  double discountPercentage, double rating, String weight, int stockQuantity,
                                  String imagePath, String ingredients, String nutrition, String shelfLife,
                                  boolean isBestSeller, boolean isNewArrival, boolean isFestivalSpecial) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setCategory(category);
        p.setPrice(price);
        p.setDiscountPercentage(discountPercentage);
        p.setRating(rating);
        p.setWeight(weight);
        p.setStockQuantity(stockQuantity);
        p.setImagePath(imagePath);
        p.setIngredients(ingredients);
        p.setNutrition(nutrition);
        p.setShelfLife(shelfLife);
        p.setBestSeller(isBestSeller);
        p.setNewArrival(isNewArrival);
        p.setFestivalSpecial(isFestivalSpecial);
        return productRepository.save(p);
    }
}
