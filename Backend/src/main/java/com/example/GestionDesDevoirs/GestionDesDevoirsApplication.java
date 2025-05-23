package com.example.GestionDesDevoirs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.GestionDesDevoirs.Repository")
@EntityScan(basePackages = "com.example.GestionDesDevoirs.Entity")
public class GestionDesDevoirsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionDesDevoirsApplication.class, args);
	}

}
