package kev.gamedb.dto;

import kev.gamedb.Cover;

public class GameSummaryDTO {
    private Integer igdbId;
    private String name;
    private Cover cover;
    private String releaseDate;

    public GameSummaryDTO() {
    }

    public GameSummaryDTO(Integer igdbId, String name, Cover cover, String releaseDate) {
        this.igdbId = igdbId;
        this.name = name;
        this.cover = cover;
        this.releaseDate = releaseDate;
    }

    public Integer getIgdbId() {
        return igdbId;
    }

    public void setIgdbId(Integer igdbId) {
        this.igdbId = igdbId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Cover getCover() {
        return cover;
    }

    public void setCover(Cover cover) {
        this.cover = cover;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }
}
