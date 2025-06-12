package com.example.CinematicMultiverse.query;

import com.example.CinematicMultiverse.pelicula.model.Genero;
import com.example.CinematicMultiverse.pelicula.model.Pelicula;
import com.example.CinematicMultiverse.util.SearchCriteria;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@AllArgsConstructor
public abstract class GenericSpecificationBuilder<U> {

    private List<SearchCriteria> params;

    public Specification<U> build() {
        if (params.isEmpty()) {
            return null;
        }

        Specification<U> result = buildSingleSpecification(params.get(0));
        result = Objects.requireNonNullElse(result, (Specification<U>) Specification.where(null));

        for(int i = 1; i < params.size(); i++) {
            Specification<U> nextSpec = buildSingleSpecification(params.get(i));
            if (nextSpec != null) {
                result = result.and(nextSpec);
            }
        }
        return result;
    }

    private Specification<U> buildSingleSpecification(SearchCriteria criteria) {
        return (root, query, builder) -> {
            if (criteria.operation().equalsIgnoreCase(">")) {
                return builder.greaterThanOrEqualTo(
                        root.get(criteria.key()), criteria.value().toString());
            }
            else if (criteria.operation().equalsIgnoreCase("<")) {

                return builder.lessThanOrEqualTo(
                        root.get(criteria.key()), criteria.value().toString());
            }
            else if (criteria.operation().equalsIgnoreCase(":")) {
                if (criteria.key().equalsIgnoreCase("generos")) {
                    String[] genreNames = criteria.value().toString().split(",");
                    List<Predicate> genrePredicates = new ArrayList<>();
                    for (String genreName : genreNames) {
                        try {
                            if (root.getJavaType().equals(Pelicula.class)) {
                                Genero targetGenre = Genero.valueOf(genreName.toUpperCase());
                                genrePredicates.add(builder.isMember(targetGenre, root.get("generos")));
                            }
                        } catch (IllegalArgumentException e) {
                        }
                    }

                    if (genrePredicates.isEmpty()) {
                        return builder.disjunction();
                    }
                    return builder.or(genrePredicates.toArray(new Predicate[0]));
                }
                else if (criteria.key().equalsIgnoreCase("puntuacionMin")) {
                    try {
                        Double minRating = java.text.NumberFormat.getInstance(Locale.US)
                                .parse(criteria.value().toString())
                                .doubleValue();
                        return builder.greaterThanOrEqualTo(root.get("puntuacion"), minRating);
                    } catch (java.text.ParseException | NumberFormatException e) {
                        return null;
                    }
                }
                else if (criteria.key().equalsIgnoreCase("puntuacionLessThan")) {
                    try {
                        Double maxRatingExclusive = java.text.NumberFormat.getInstance(Locale.US)
                                .parse(criteria.value().toString())
                                .doubleValue();
                        return builder.lessThan(root.get("puntuacion"), maxRatingExclusive);
                    } catch (java.text.ParseException | NumberFormatException e) {
                        return null;
                    }
                }
                else {
                    if (root.get(criteria.key()).getJavaType() == String.class) {
                        return builder.like(
                                root.<String>get(criteria.key()), "%" + criteria.value() + "%");
                    } else if (root.get(criteria.key()).getJavaType() == Integer.class) {
                        try {
                            return builder.equal(root.get(criteria.key()), Integer.parseInt(criteria.value().toString()));
                        } catch (NumberFormatException e) {
                            return null;
                        }
                    }
                    else {
                        return builder.equal(root.get(criteria.key()), criteria.value());
                    }
                }
            }
            return null;
        };
    }
}