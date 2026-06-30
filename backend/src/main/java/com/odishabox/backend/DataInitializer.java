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

        Category sweets = categoryRepository.findBySlug("traditional-sweets")
                .orElseGet(() -> categoryRepository.save(new Category("Traditional Sweets", "Authentic Odia desserts and pithas made by master karigars", "sweets.jpg", "traditional-sweets")));

        Category grocery = categoryRepository.findBySlug("grocery")
                .orElseGet(() -> categoryRepository.save(new Category("Grocery", "Staples, badis, oil, and authentic local spices", "grocery.jpg", "grocery")));

        Category pickles = categoryRepository.findBySlug("pickles")
                .orElseGet(() -> categoryRepository.save(new Category("Pickles", "Homemade sour, sweet and spicy pickles of Odisha", "pickles.jpg", "pickles")));

        Category snacks = categoryRepository.findBySlug("snacks")
                .orElseGet(() -> categoryRepository.save(new Category("Snacks", "Traditional dry snacks, muan, and mixture to go with tea", "snacks.jpg", "snacks")));

        Category combo = categoryRepository.findBySlug("festival-boxes")
                .orElseGet(() -> categoryRepository.save(new Category("Festival Boxes", "Specially curated combos and festival special boxes", "combos.jpg", "festival-boxes")));

        if (productRepository.count() == 0) {
            createProduct("Chhena Poda", "The crown jewel of Odia sweets. Baked cottage cheese dessert caramelized with sugar. Prepared traditional way with sal leaves.", sweets, 350.0, 10.0, 4.9, "500g", 50, "chhena_poda.jpg", "Chhena (Paneer), Sugar, Semolina, Cardamom, Ghee", "Energy: 310 kcal, Fat: 14g, Protein: 11g, Carbs: 35g per 100g", "7 Days", true, false, false);
            createProduct("Puri Khaja", "Famous crispy, multi-layered sweet from the holy city of Puri. Made from refined flour and dipped in sugar syrup.", sweets, 180.0, 5.0, 4.8, "500g", 100, "khaja.jpg", "Refined Flour (Maida), Ghee, Sugar, Cardamom", "Energy: 420 kcal, Fat: 18g, Protein: 4g, Carbs: 60g per 100g", "30 Days", false, true, false);
            createProduct("Kendrapara Rasabali", "Deep-fried flattened reddish-brown cheese patties soaked in thick, sweetened seasoned milk (rabri).", sweets, 240.0, 0.0, 4.7, "4 Pcs", 30, "rasabali.jpg", "Chhena, Milk, Sugar, Cardamom, Ghee", "Energy: 280 kcal, Fat: 12g, Protein: 9g, Carbs: 30g per 100g", "3 Days", true, false, false);
            createProduct("Chhena Gaja", "A sweet made by combining chhena (cottage cheese) and semolina, shaping it into rectangular blocks, deep frying, and soaking in syrup.", sweets, 200.0, 10.0, 4.6, "500g", 40, "gaja.jpg", "Chhena, Semolina, Sugar, Cardamom, Ghee", "Energy: 340 kcal, Fat: 15g, Protein: 8g, Carbs: 45g per 100g", "10 Days", false, false, false);

            createProduct("Keonjhar Phula Badi", "Light, crispy sun-dried lentil dumplings made of black gram paste. Can be fried and served as a crunchy side dish.", grocery, 120.0, 0.0, 4.8, "250g", 75, "badi.jpg", "Black Gram (Biri), Spices, Sesame Seeds", "Energy: 320 kcal, Protein: 22g, Carbs: 58g, Fat: 1.5g per 100g", "90 Days", true, false, false);
            createProduct("Homemade Ambula", "Salted sun-dried green mango halves. Widely used in Odia cuisine for souring curries like Dalma and fish dishes.", grocery, 90.0, 0.0, 4.9, "150g", 80, "ambula.jpg", "Raw Mango, Salt", "Energy: 120 kcal, Carbs: 28g, Sodium: 1200mg per 100g", "180 Days", false, false, false);
            createProduct("Organic Mandia Flour", "Nutritious Ragi (Finger Millet) flour. Highly popular in Odisha for preparing Mandia Jau (porridge) and healthy pithas.", grocery, 80.0, 5.0, 4.5, "1 kg", 120, "mandia.jpg", "100% Finger Millet (Ragi)", "Energy: 336 kcal, Protein: 7.3g, Iron: 3.9mg, Dietary Fiber: 11.5g per 100g", "90 Days", false, true, false);

            createProduct("Odia Mango Pickle", "Traditional home-style raw mango pickle preserved in pure mustard oil and aromatic spices. Perfectly sour and spicy.", pickles, 140.0, 10.0, 4.7, "400g", 90, "mango_pickle.jpg", "Raw Mango, Mustard Oil, Fenugreek, Mustard Seeds, Red Chili, Salt", "Energy: 180 kcal, Fat: 14g, Carbs: 10g per 100g", "365 Days", true, false, false);
            createProduct("Bamboo Shoot (Kardi) Pickle", "Unique, crunchy pickle made of tender bamboo shoots collected from the forests of Western Odisha. Distinct tanginess.", pickles, 180.0, 0.0, 4.8, "400g", 45, "bamboo_pickle.jpg", "Bamboo Shoot, Mustard Oil, Spices, Garlic, Salt", "Energy: 110 kcal, Fat: 8g, Fiber: 4g per 100g", "180 Days", false, true, false);

            createProduct("Puri Lia Muan", "Sweet puff rice balls bound with rich liquid jaggery, flavored with ginger and cardamom. An essential Jagannath temple prasad.", snacks, 70.0, 0.0, 4.5, "6 Pcs", 150, "muan.jpg", "Puffed Rice (Lia), Jaggery, Coconut flakes, Ginger, Cardamom", "Energy: 350 kcal, Carbs: 78g, Protein: 3g per 100g", "45 Days", false, false, false);
            createProduct("Special Odia Mixture", "A crunchy tea-time snack mixture consisting of gram flour sev, peanuts, cashews, curry leaves, and traditional spices.", snacks, 85.0, 5.0, 4.7, "250g", 110, "mixture.jpg", "Gram Flour, Peanuts, Cashew Nuts, Mustard Oil, Salt, Curry Leaves, Chili Powder", "Energy: 510 kcal, Fat: 28g, Protein: 12g, Carbs: 45g per 100g", "60 Days", true, false, false);

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
