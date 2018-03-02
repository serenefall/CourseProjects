package ca.ubc.cs.cpsc210.translink.parsers;

import ca.ubc.cs.cpsc210.translink.model.Arrival;
import ca.ubc.cs.cpsc210.translink.model.Route;
import ca.ubc.cs.cpsc210.translink.model.RouteManager;
import ca.ubc.cs.cpsc210.translink.model.Stop;
import ca.ubc.cs.cpsc210.translink.parsers.exception.ArrivalsDataMissingException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * A parser for the data returned by the Translink arrivals at a stop query
 */
public class ArrivalsParser {

    /**
     * Parse arrivals from JSON response produced by TransLink query.  All parsed arrivals are
     * added to the given stop assuming that corresponding JSON object has a RouteNo: and an
     * array of Schedules:
     * Each schedule must have an ExpectedCountdown, ScheduleStatus, and Destination.  If
     * any of the aforementioned elements is missing, the arrival is not added to the stop.
     *
     * @param stop             stop to which parsed arrivals are to be added
     * @param jsonResponse    the JSON response produced by Translink
     * @throws JSONException  when:
     * <ul>
     *     <li>JSON response does not have expected format (JSON syntax problem)</li>
     *     <li>JSON response is not an array</li>
     * </ul>
     * @throws ArrivalsDataMissingException  when no arrivals are found in the reply
     */
    public static void parseArrivals(Stop stop, String jsonResponse)
            throws JSONException, ArrivalsDataMissingException {
        JSONArray arrivals;
        JSONObject arrivalsAt;
        JSONArray schedulesAt;
        JSONObject arrival;
        int successCount = 0;

        arrivals = new JSONArray(jsonResponse);
        for (int index = 0; index < arrivals.length(); index++) {
            try {
                arrivalsAt = arrivals.getJSONObject(index);

                String routeNo = arrivalsAt.getString("RouteNo");
                RouteManager rm = RouteManager.getInstance();
                Route r = rm.getRouteWithNumber(routeNo);

                schedulesAt = arrivalsAt.getJSONArray("Schedules");

                for (int i = 0; i < schedulesAt.length(); i++) {
                    arrival = schedulesAt.getJSONObject(i);
                    if (arrival.has("Destination") && arrival.has("ExpectedCountdown") && arrival.has("ScheduleStatus")) {
                        successCount++;
                        String des = arrival.getString("Destination");
                        String status = arrival.getString("ScheduleStatus");
                        int countDown = arrival.getInt("ExpectedCountdown");
                        Arrival a = new Arrival(countDown, des, r);
                        a.setStatus(status);
                        stop.addArrival(a);
                    }
                }
            } catch (JSONException e) {}
        }
        if (successCount == 0)
            throw new ArrivalsDataMissingException("All arrvival data missing.");
    }
}
