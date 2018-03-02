package ca.ubc.cs.cpsc210.translink.parsers;

import ca.ubc.cs.cpsc210.translink.model.RouteManager;
import ca.ubc.cs.cpsc210.translink.model.Stop;
import ca.ubc.cs.cpsc210.translink.model.Route;
import ca.ubc.cs.cpsc210.translink.model.StopManager;
import ca.ubc.cs.cpsc210.translink.parsers.exception.StopDataMissingException;
import ca.ubc.cs.cpsc210.translink.providers.DataProvider;
import ca.ubc.cs.cpsc210.translink.providers.FileDataProvider;
import ca.ubc.cs.cpsc210.translink.util.LatLon;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

/**
 * A parser for the data returned by Translink stops query
 */
public class StopParser {

    private String filename;

    public StopParser(String filename) {
        this.filename = filename;
    }

    /**
     * Parse stop data from the file and add all stops to stop manager.
     */
    public void parse() throws IOException, StopDataMissingException, JSONException {
        DataProvider dataProvider = new FileDataProvider(filename);

        parseStops(dataProvider.dataSourceToString());
    }

    /**
     * Parse stop information from JSON response produced by Translink.
     * Stores all stops and routes found in the StopManager and RouteManager.
     *
     * @param jsonResponse string encoding JSON data to be parsed
     * @throws JSONException            when:
     *                                  <ul>
     *                                  <li>JSON data does not have expected format (JSON syntax problem)</li>
     *                                  <li>JSON data is not an array</li>
     *                                  </ul>
     *                                  If a JSONException is thrown, no stops should be added to the stop manager
     * @throws StopDataMissingException when
     *                                  <ul>
     *                                  <li> JSON data is missing Name, StopNo, Routes or location (Latitude or Longitude) elements for any stop</li>
     *                                  </ul>
     *                                  If a StopDataMissingException is thrown, all correct stops are first added to the stop manager.
     */

    public void parseStops(String jsonResponse)
            throws JSONException, StopDataMissingException {
        StopManager sm = StopManager.getInstance();
        RouteManager rm = RouteManager.getInstance();
        JSONArray stops;
        JSONObject stop;
        Stop s;
        String name;
        int stopNo;
        double lat;
        double lon;
        String routes;
        String routeNumber;
        int missingCount = 0;


        stops = new JSONArray(jsonResponse);
        for (int index = 0; index < stops.length(); index++) {
            try {
                stop = stops.getJSONObject(index);
                name = stop.getString("Name");
                stopNo = stop.getInt("StopNo");
                lat = stop.getDouble("Latitude");
                lon = stop.getDouble("Longitude");
                LatLon pos = new LatLon(lat, lon);
                routes = stop.getString("Routes");
                s = sm.getStopWithNumber(stopNo, name, pos);

                while (routes.contains(",")) {
                    int size = routes.length();
                    int posn = 0;
                    int endposn = routes.indexOf(",", posn);
                    routeNumber = routes.substring(posn, endposn);
                    Route r = rm.getRouteWithNumber(routeNumber);
                    s.addRoute(r);
                    routes = routes.substring(endposn + 2, size);
                }
                Route r = rm.getRouteWithNumber(routes);
                s.addRoute(r);

            } catch (JSONException e) {
                missingCount++;
            }
        }
        if (missingCount > 0) throw new StopDataMissingException("Stop data missing");
    }
}
