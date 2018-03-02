package ca.ubc.cs.cpsc210.translink.util;

import java.awt.geom.Line2D;

/**
 * Compute relationships between points, lines, and rectangles represented by LatLon objects
 */
public class Geometry {
    /**
     * Return true if the point is inside of, or on the boundary of, the rectangle formed by northWest and southeast
     * @param northWest         the coordinate of the north west corner of the rectangle
     * @param southEast         the coordinate of the south east corner of the rectangle
     * @param point             the point in question
     * @return                  true if the point is on the boundary or inside the rectangle
     */
    public static boolean rectangleContainsPoint(LatLon northWest, LatLon southEast, LatLon point) {

        double pLon = point.getLongitude();
        double pLat = point.getLatitude();
        double nwLon = northWest.getLongitude();
        double nwLat = northWest.getLatitude();
        double seLon = southEast.getLongitude();
        double seLat = southEast.getLatitude();

//        if (nwLon >= 0 && seLon <= 0)
//            if ((0 <= pLon && pLon < nwLon) || (0 > pLon && pLon > seLon)) return false;
//        else

        return (pLat <= nwLat && pLat >= seLat && pLon >= nwLon && pLon <= seLon);
    }

    /**
     * Return true if the rectangle intersects the line
     * @param northWest         the coordinate of the north west corner of the rectangle
     * @param southEast         the coordinate of the south east corner of the rectangle
     * @param src               one end of the line in question
     * @param dst               the other end of the line in question
     * @return                  true if any point on the line is on the boundary or inside the rectangle
     */
    public static boolean rectangleIntersectsLine(LatLon northWest, LatLon southEast, LatLon src, LatLon dst) {
        if (rectangleContainsPoint(northWest, southEast, src)) return true;
        if (rectangleContainsPoint(northWest, southEast, dst)) return true;

        double sLon = (src.getLongitude());
        double sLat = (src.getLatitude());
        double dLon = (dst.getLongitude());
        double dLat = (dst.getLatitude());
        double nwLon = (northWest.getLongitude());
        double nwLat = (northWest.getLatitude());
        double seLon = (southEast.getLongitude());
        double seLat = (southEast.getLatitude());

//        if (nwLon >= 0 && seLon <= 0) {
//            int plus = 36000000;
//            recWidth = seLon - nwLon + plus;
//            recHeight = nwLat - seLat;
//            if (sLon < 0) sLon += plus;
//            if (dLon < 0) dLon += plus;
//        } else {
       // recWidth = seLon - nwLon;
       // recHeight = nwLat - seLat;
       // }
       // Rectangle r = new Rectangle(nwLon, nwLat, recWidth, recHeight);
        Line2D l = new Line2D.Double(sLon, sLat, dLon, dLat);
        boolean xl1 = l.intersectsLine(nwLon, nwLat, seLon, nwLat);
        boolean xl2 = l.intersectsLine(seLon, nwLat, seLon, seLat);
        boolean xl3 = l.intersectsLine(nwLon, seLat, nwLon, seLat);
        boolean xl4 = l.intersectsLine(nwLon, nwLat, nwLon, seLat);

        return (xl1 || xl2 || xl3 || xl4);
    }

    /**
     * A utility method that you might find helpful in implementing the two previous methods
     * Return true if x is >= lwb and <= upb
     * @param lwb      the lower boundary
     * @param upb      the upper boundary
     * @param x         the value in question
     * @return          true if x is >= lwb and <= upb
     */
    private static boolean between(double lwb, double upb, double x) {
        return lwb <= x && x <= upb;
    }
}
