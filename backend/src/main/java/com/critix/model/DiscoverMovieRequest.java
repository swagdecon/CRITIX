package com.critix.model;

import info.movito.themoviedbapi.tools.sortby.DiscoverMovieSortBy;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DiscoverMovieRequest {

    public DiscoverMovieSortBy sortBy;
    public String certification;
    public String certificationGte;
    public String certificationLte;
    public String certificationCountry;
    public Boolean includeAdult;
    public Boolean includeVideo;
    public String language;
    public Integer page;
    public Integer primaryReleaseYear;
    public String primaryReleaseDateGte;
    public String primaryReleaseDateLte;
    public String region;
    public String releaseDateGte;
    public String releaseDateLte;
    public Float voteAverageGte;
    public Float voteAverageLte;
    public Integer voteCountGte;
    public Integer voteCountLte;
    public String withCast;
    public String withCompanies;
    public String withCrew;
    public String withGenres;
    public String withKeywords;
    public String withOriginCountry;
    public String withOriginalLanguage;
    public String withPeople;
    public String withReleaseType;
    public Integer withRuntimeGte;
    public Integer withRuntimeLte;
    public String withoutCompanies;
    public String withoutGenres;
    public String withoutKeywords;
    public String withoutWatchProviders;
    public String withWatchProviders;
    public String withWatchMonetizationTypes;
    public String watchRegion;
    public Integer year;
}
